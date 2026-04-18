const router = require('express').Router()
const songController = require('../controllers/song')
const playlistController = require('../controllers/playlist')

// define routes preceding with: public/...

// GET all songs
router.get('/songs', songController.getSongs)

// GET song by id
router.get('/song/:songId', songController.getSongById)

// GET all playlists
router.get('/playlists', playlistController.getPublicPlaylists)

// GET playlist by id
router.get('/playlist/:playlistId', playlistController.getPlaylistById)

// export router
module.exports = router
