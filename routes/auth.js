const router = require('express').Router()
const authController = require('../controllers/auth')

// define routes preceding with: auth/...

// GET user
router.get('/user', authController.getLoggedUser)

// POST login
router.post('/login', authController.postLogin)

// POST Guest login
router.post('/login/guest', authController.postGuestLogin)

// POST Sign UP
router.post('/signup', authController.postSignup)

module.exports = router
