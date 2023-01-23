// core modules imports
const path = require('path')
const fs = require('fs')

// third-party imports
require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const multer = require('multer')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const bcryptjs = require('bcryptjs')
// const csurf = require('csurf')
// const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')

// local imports
const User = require('./models/user')
const b2 = require('./utils/b2')
const dbConnect = require('./utils/db').dbConnect
const jwtAuthMiddleware = require('./middlewares/jwtAuth')
// const authenticateSessionMiddleware = require('./middlewares/authenticateSession')

// route imports
const publicRoutes = require('./routes/public')
const privateRoutes = require('./routes/private')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

// required objects
const app = express()
const multerStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().getTime() +
        '-' +
        file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
    )
  },
  destination: (req, file, cb) => {
    // create the directories if not exist
    fs.mkdirSync('static/media/audio', { recursive: true })
    fs.mkdirSync('static/media/images', { recursive: true })

    // save the files based on the field provided
    if (file.fieldname === 'imageFile') {
      cb(null, './static/media/images')
    } else if (file.fieldname === 'audioFile') {
      cb(null, './static/media/audio')
    } else {
      cb(Error('unknown field'))
    }
  },
})

const multerMiddleware = multer({
  storage: multerStorage,
  limits: {
    fileSize: (process.env.MULTER_MAX_FILE_SIZE || 1) * 1024 * 1024,
  },
}).fields([
  { name: 'imageFile', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 },
])

const mongodbSessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'session',
})

// middlewares
// securing headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         'script-src': ["'self'", "'unsafe-inline'"],
//         'script-src-attr': ["'unsafe-inline'"],
//         'img-src': ["'self'", '*'],
//       },
//     },
//     crossOriginEmbedderPolicy: false,
//   })
// )
// app.use(helmet())
app.use(cors())

// using compression
app.use(compression())

// parsing body-content
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use((req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err)
      return res.status(500).json({
        status: 'error',
        msg: 'Error while storing files using multer storage!',
        err: err,
      })
    next()
  })
})

// set up session using mongodb-store
app.use(
  session({
    secret: 'musicwire-session-secret',
    resave: false,
    saveUninitialized: false,
    store: mongodbSessionStore,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
)
// app.use(authenticateSessionMiddleware)
app.use(jwtAuthMiddleware.setAuth)
// app.use(csurf())

// serve public files
app.use(express.static(path.join(__dirname, 'public')))
// serve media files from local storage
app.use('/media', express.static(path.join(__dirname, 'static', 'media')))
// if b2-storage flag is enabled fetch file from b2 to local
if (process.env.ENABLE_B2_STORAGE === 'true') {
  app.use('/media', (req, res, next) => {
    const localBaseFolder = 'static'
    const fileKey = req.originalUrl.startsWith('/')
      ? req.originalUrl.slice(1)
      : req.originalUrl
    b2.fetchFileToLocal(fileKey, localBaseFolder).then((buffer) => {
      if (buffer) {
        if (fileKey.startsWith('media/audio')) {
          res.setHeader('Content-Type', 'audio/mp3')
        }
        return res.send(buffer)
      } else {
        return next()
      }
    })
  })
}

// serving routes
app.use('/api/public', publicRoutes)
app.use('/api/auth', authRoutes)
app.use(
  '/api/private',
  jwtAuthMiddleware.checkRole(['ADMIN', 'USER', 'GUEST']),
  privateRoutes
)
app.use('/api/admin', jwtAuthMiddleware.checkRole(['ADMIN']), adminRoutes)

// handle Internal server errors
app.use((err, req, res, next) => {
  if (err) {
    console.log('Internal-error', err)
    return res.status(500).json({
      msg: 'Internal Server Error',
      err: err,
    })
  }
  // if no error found continue to next routes
  next()
})

// serve static files from frontend build
app.use(express.static(path.join(__dirname, 'frontend', 'build')))
// serve frontend routes

app.get('/*', (req, res, next) => {
  const indexPath = path.join(__dirname, 'frontend', 'build', 'index.html')
  if (fs.existsSync(indexPath)) return res.status(200).sendFile(indexPath)
  next()
})

// declare host and port
const PORT = process.env.PORT || 8000
const HOST = process.env.HOST || '0.0.0.0'
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/musicwire'

const SALT_LENGTH = 12
// start server
dbConnect(MONGODB_URI).then(() => {
  User.findOne({ role: 'ADMIN' })
    .then((admin) => {
      if (!admin) {
        const password = process.env.ADMIN_PASS || 'admin'
        bcryptjs.hash(password, SALT_LENGTH).then((hashedPassword) => {
          const defaultAdmin = new User({
            email: 'admin@musicwire',
            password: hashedPassword,
            role: 'ADMIN',
          })
          return defaultAdmin.save()
        })
      }
    })
    .catch((err) => {
      console.log('__error_while_creating_default_admin__', err)
    })
  app.listen(PORT, HOST, (err) => {
    console.log(`App started at port:${PORT}`)
  })
})
