// core modules imports
const path = require('path')
const fs = require('fs')

// third-party imports
const express = require('express')
const bodyparser = require('body-parser')
const multer = require('multer')

// local imports
const Album = require('./models/album')
const Song = require('./models/song')

// route imports
const albumRoutes = require('./routes/album')
const songRoutes = require('./routes/song')
const authRoutes = require('./routes/auth')

// initialize variables
const dbConnect = require('./utils/db').dbConnect
const app = express()
const uploadedFileStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
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

// set view engine for templating
app.set('view engine', 'ejs')

// middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use('/media', express.static(path.join(__dirname, 'static', 'media')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
// app.use(multer({ storage: uploadedFileStorage }).single('album_logo'))
app.use(
  multer({ storage: uploadedFileStorage }).fields([
    { name: 'album_logo', maxCount: 1 },
    { name: 'audio_file', maxCount: 1 },
  ])
)

// define routes
app.get('/', (req, res) => {
  const searchQuery = req.query.q ? req.query.q : ''
  Album.find()
    .lean()
    .then((albums) => {
      Song.find()
        .lean()
        .populate('album')
        .then((songs) => {
          return res.render('albums', {
            albums: albums,
            songs: songs,
            searchQuery: searchQuery,
            path: '/',
          })
        })
    })
    .catch((err) => {
      console.log('Error while fething index!\n', err)
      return res.render('internal_server_error')
    })
})

app.get('/test', (req, res) => {
  return res.render('test', {
    data: '',
  })
})

// use imported routes
app.use('/album', albumRoutes)
app.use('/song', songRoutes)
app.use('/auth', authRoutes)

// use not-Found
const notFoundRoute = (req, res, next) => {
  return res.render('404NotFound')
}
app.get('/404', notFoundRoute)
app.get('/500', (req, res) => {
  return res.render('500InternalServerError')
})
app.use(notFoundRoute)

// declare host and port
const PORT = 3000
const HOST = '0.0.0.0'
const MONGODB_URI = 'mongodb://localhost:27017/musicwire'

// start server
;(() => {
  dbConnect(MONGODB_URI).then(() => {
    app.listen(PORT, HOST, (err) => {
      console.log(`App started at port:${PORT}`)
    })
  })
})()
