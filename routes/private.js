const router = require('express').Router()
const songController = require('../controllers/song')
const playlistController = require('../controllers/playlist')
const userController = require('../controllers/user')

// define routes preceding with: private/...

// GET user's profile
router.get('/profile', userController.getUserProfile)

// PATCH edit user profile
router.patch('/profile', userController.patchEditProfile)

// GET all user's favorite songs
router.get('/favorites', songController.getUserSongs)

// PATCH toggle favorite
router.patch('/favorite/toggle', songController.patchToggleFavorite)

// GET all user's playlists
router.get('/playlists', playlistController.getUserPlaylists)

// POST add playlist
router.post('/playlist/add', playlistController.postAddPlaylist)

// PATCH edit playlist
router.patch('/playlist', playlistController.patchEditPlaylist)

// DELETE playlist
router.delete('/playlist', playlistController.deletePlaylist)

// POST add song to playlist
router.post('/playlist/addsong', playlistController.postAddSongToPlaylist)

// PATCH delete song from playlist
router.patch(
  '/playlist/deletesong',
  playlistController.patchDeleteSongFromPlaylist
)

module.exports = router
