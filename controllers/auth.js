const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')

const LOGIN_PERIOD_SEC = 36000
const SALT_LENGTH = 12
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key'

module.exports.getLoggedUser = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId)
    return res.status(401).json({
      status: 'error',
      msg: 'user not logged in',
    })
  User.findById(userId)
    .lean()
    .then((user) => {
      if (!userId)
        return res.status(404).json({
          status: 'error',
          msg: 'user not found in database',
        })
      return res.status(200).json({
        status: 'ok',
        msg: 'user details fetch success',
        user: {
          _id: user._id,
          profile: user.profile,
          email: user.email,
          role: user.role,
        },
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({
      status: 'error',
      msg: 'email or password not provided',
    })

  let currentUser
  User.findOne({ email: email })
    .lean()
    .then((user) => {
      if (!user)
        return res.status(401).json({
          status: 'error',
          msg: 'user not found-test',
        })
      currentUser = user
      // compare the password
      return bcryptjs.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(401).json({
            status: 'error',
            msg: 'incorrect password',
          })
        // return jwt token
        const token = jwt.sign(
          { userId: user._id.toString() }, // payload
          JWT_SECRET, // secret
          { expiresIn: LOGIN_PERIOD_SEC } // options
        )
        return res.status(200).json({
          status: 'ok',
          msg: 'authentication success',
          user: {
            _id: currentUser._id,
            profile: currentUser.profile,
            email: currentUser.email,
            role: currentUser.role,
          },
          token: token,
        })
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.postGuestLogin = (req, res, next) => {
  User.findOne({ role: 'GUEST' })
    .then((guest) => {
      if (!guest)
        return res.status(401).json({
          status: 'error',
          msg: 'guest account does not exist',
        })
      // login with guest account
      const token = jwt.sign({ userId: guest._id.toString() }, JWT_SECRET, {
        expiresIn: LOGIN_PERIOD_SEC,
      })
      return res.status(200).json({
        status: 'ok',
        msg: 'guest authenticated',
        guest: {
          _id: guest._id,
          profile: guest.profile,
          email: guest.email,
          role: guest.role,
        },
        token: token,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.postSignup = (req, res, next) => {
  const { email, password, name } = req.body
  if (!email || !password)
    return res.status(400).json({
      status: 'error',
      msg: 'email or password not provided',
    })
  User.findOne({ email: email })
    .then((user) => {
      if (user)
        return res.status(409).json({
          status: 'error',
          msg: 'email exists',
        })
      // create a new user
      const newUser = new User({
        email: email,
        role: 'USER',
        profile: { name: name },
      })
      return bcryptjs
        .hash(password, SALT_LENGTH)
        .then((hashedPassword) => {
          newUser.password = hashedPassword
          return newUser.save()
        })
        .then((newUser) => {
          return res.status(201).json({
            status: 'ok',
            msg: 'user created',
            user: {
              profile: newUser.profile,
              email: newUser.email,
              role: newUser.role,
            },
          })
        })
    })
    .catch((err) => {
      next(err)
    })
}
