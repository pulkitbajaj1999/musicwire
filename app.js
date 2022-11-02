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
const csurf = require('csurf')
const helmet = require('helmet')
const compression = require('compression')

// local imports
const Album = require('./models/album')
const Song = require('./models/song')
const b2 = require('./utils/b2')
const dbConnect = require('./utils/db').dbConnect
const authenticateSessionMiddleware = require('./middlewares/authenticateSession')

// route imports
const albumRoutes = require('./routes/album')
const songRoutes = require('./routes/song')
const authRoutes = require('./routes/auth')

// required objects
const app = express()
app.set('view engine', 'ejs')
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
    fs.mkdirSync('static/media/songs', { recursive: true })
    fs.mkdirSync('static/media/albums', { recursive: true })
    if (file.fieldname === 'album_logo') {
      cb(null, './static/media/albums')
    } else if (file.fieldname === 'audio_file') {
      cb(null, './static/media/songs')
    } else {
      cb(null, './static/temp')
    }
  },
})
const multerMiddleware = multer({
  storage: multerStorage,
  limits: {
    fileSize: (process.env.MULTER_MAX_FILE_SIZE || 1) * 1024 * 1024,
  },
}).fields([
  { name: 'album_logo', maxCount: 1 },
  { name: 'audio_file', maxCount: 1 },
])

const mongodbSessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'session',
})

// middlewares
// securing headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'", "'unsafe-inline'"],
        'script-src-attr': ["'unsafe-inline'"],
      },
    },
  })
)
app.use(compression())

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
// using multer-middleware function to parse files and handle error if any
app.use((req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) {
      console.log('Error while storing files using multer storage!\n', err)
      req.multerError = err
    }
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
app.use(authenticateSessionMiddleware)
app.use(csurf())
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
        if (fileKey.startsWith('media/song')) {
          res.setHeader('Content-Type', 'audio/mp3')
        }
        return res.send(buffer)
      } else {
        return next()
      }
    })
  })
}

// define routes
app.get(['/', '/home'], async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/auth/login')
  }
  const searchQuery = req.query.q ? req.query.q : ''
  let albums = []
  let songs = []
  try {
    if (searchQuery) {
      albums = await Album.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { artist: { $regex: searchQuery, $options: 'i' } },
          { genre: { $regex: searchQuery, $options: 'i' } },
        ],
      }).lean()
      songs = await Song.find({
        title: { $regex: searchQuery, $options: 'i' },
      })
        .populate('album')
        .lean()
    } else {
      albums = await Album.find().lean()
      songs = await Song.find().populate('album').lean()
    }
  } catch (err) {
    console.log('Error while fething index!\n', err)
    return res.render('500InternalServerError', {
      isLoggedIn: req.isLoggedIn,
      csrf_token: req.csrfToken(),
    })
  }
  return res.render('albums', {
    albums: albums,
    songs: songs,
    searchQuery: searchQuery,
    path: '/',
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
})

app.get('/test', (req, res) => {
  return res.render('test', {
    data: '',
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
})

// use imported routes
app.use('/album', albumRoutes)
app.use('/song', songRoutes)
app.use('/auth', authRoutes)

// use not-Found
const notFoundRoute = (req, res, next) => {
  return res.status(404).render('404NotFound', {
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
}
app.get('/404', notFoundRoute)
app.get('/500', (req, res) => {
  return res.status(500).render('500InternalServerError', {
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
})
app.use(notFoundRoute)

// declare host and port
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/musicwire'

// start server
;(() => {
  dbConnect(MONGODB_URI).then(() => {
    app.listen(PORT, HOST, (err) => {
      console.log(`App started at port:${PORT}`)
    })
  })
})()
