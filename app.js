// package imports
const express = require('express')
const bodyparser = require('body-parser')

// file imports
const staticData = require('./utils/static_data')

// route imports
const albumRoutes = require('./routes/album')
const songRoutes = require('./routes/song')
const authRoutes = require('./routes/auth')
const notFound = require('./middlewares/notFound')

// initialize variables
const dbConnect = require('./utils/db').dbConnect
const app = express()

// set view engine for templating
app.set('view engine', 'ejs')

// middlewares
app.use('/static', express.static('public'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// define routes
app.get('/', (req, res) => {
  const searchQuery = req.query.q ? req.query.q : ''
  return res.render('albums', {
    albums: staticData.albums,
    songs: staticData.songs,
    searchQuery: searchQuery,
    path: '/',
  })
})

app.get('/test', (req, res) => {
  return res.render('test', {
    data: 'my-test',
  })
})

// use imported routes
app.use('/album', albumRoutes)
app.use('/song', songRoutes)
app.use('/auth', authRoutes)

// use not-Found
app.use('/', notFound)

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
