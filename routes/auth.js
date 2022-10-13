const router = require('express').Router()
const authController = require('../controllers/auth')

// define routes
// GET login
router.get('/login', authController.getLogin)

// POST login
router.post('/login', authController.postLogin)

// POST logout
router.post('/logout', authController.postLogout)

// GET Sign UP
router.get('/signup', authController.getSignup)

// POST Sign UP
router.post('/signup', authController.postSignup)

// POST Guest login
router.post('/guest', authController.postGuestLogin)

// export router
module.exports = router
