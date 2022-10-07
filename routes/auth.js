const router = require('express').Router()
const authController = require('../controllers/auth')

// define routes
// GET login
router.get('/login', authController.getLogin)

// POST login
router.post('/login', authController.postLogin)

// GET logout
router.get('/logout', authController.getLogout)

// GET Sign UP
router.get('/signup', authController.getSignup)

// POST Sign UP
router.post('/signup', authController.postSignup)

// POST Guest login
router.post('/guest', authController.postGuestLogin)

// export router
module.exports = router
