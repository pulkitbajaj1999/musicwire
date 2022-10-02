const router = require('express').Router()
const songController = require('../controllers/song')

// define routes preceding with: /song/...
// GET all songs
router.get('/', songController.getAllSongs)

// GET favorite songs
router.get('/favorite', songController.getfavoriteSongs)

// GET toggle favorite
router.post('/togglefav', songController.togglefavorite)

// POST delete song
router.post('/delete', songController.postDeleteSong)

// export router
module.exports = router
