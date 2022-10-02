const router = require('express').Router()
const albumController = require('../controllers/album')

// define routes preceding with: /album/...
// home-page, GET all albums
router.get('/', albumController.getAllAlbums)

// GET album details
router.get('/:albumId(\\d+)', albumController.getAlbum)

// GET create album page
router.get('/add', albumController.getCreateAlbum)

// POST create album
router.post('/add', albumController.postCreateAlbum)

// POST delete album
router.post('/delete', albumController.postDeleteAlbum)

// GET add song to album
router.get('/:albumId(\\d+)/addsong', albumController.getAddSongToAlbum)

// POST add song to album
router.post('/addsong', albumController.postAddSongToAlbum)

// POST Toggle favorite
router.post('/togglefav', albumController.postToggleFav)

// export router
module.exports = router
