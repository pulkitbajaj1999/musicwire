const router = require('express').Router()
const songController = require('../controllers/song')
const userController = require('../controllers/user')

// define routes preceding with: admin/...

// POST add song
router.post('/song/add', songController.postAddSong)

// PATCH edit song
router.patch('/song', songController.patchEditSong)

// DELETE song
router.delete('/song', songController.deleteSong)

// DELETE user
router.delete('/user', userController.deleteUser)

module.exports = router
