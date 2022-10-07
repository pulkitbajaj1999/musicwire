// core modules imports
const path = require('path')
const fs = require('fs')

// third-party imports
require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const multer = require('multer')

// local imports
const Album = require('./models/album')
const Song = require('./models/song')
const b2 = require('./utils/b2')

// route imports
const albumRoutes = require('./routes/album')
const songRoutes = require('./routes/song')
const authRoutes = require('./routes/auth')

// initialize variables
const dbConnect = require('./utils/db').dbConnect
const app = express()
const multerStorage = multer.diskStorage({
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
const multerMiddleware = multer({
  storage: multerStorage,
  limits: {
    fileSize: (process.env.MULTER_MAX_FILE_SIZE || 1) * 1024 * 1024,
  },
}).fields([
  { name: 'album_logo', maxCount: 1 },
  { name: 'audio_file', maxCount: 1 },
])

// set view engine for templating
app.set('view engine', 'ejs')

// middlewares
// serve public files from static storage
app.use(express.static(path.join(__dirname, 'public')))
// use check in local storage for serving media files else fetch from B2 storage
app.use(
  '/media',
  express.static(path.join(__dirname, 'static', 'media')),
  (req, res, next) => {
    const localBaseFolder = 'static'
    const fileKey = req.originalUrl.startsWith('/')
      ? req.originalUrl.slice(1)
      : req.originalUrl
    b2.fetchFileToLocal(fileKey, localBaseFolder).then((buffer) => {
      if (buffer) {
        return res.send(buffer)
      } else {
        return next()
      }
    })
  }
)

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

// define routes
app.get(['/', '/home'], async (req, res) => {
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
      }).lean()
    } else {
      albums = await Album.find().lean()
      songs = await Song.find().populate('album').lean()
    }
  } catch (err) {
    console.log('Error while fething index!\n', err)
    return res.render('500InternalServerError')
  }
  return res.render('albums', {
    albums: albums,
    songs: songs,
    searchQuery: searchQuery,
    path: '/',
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
  return res.status(404).render('404NotFound')
}
app.get('/404', notFoundRoute)
app.get('/500', (req, res) => {
  return res.status(500).render('500InternalServerError')
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
