// utils
const b2 = require('../utils/b2')

// models
const User = require('../models/user')

module.exports.getUserProfile = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId)
    return res.status(401).json({
      status: 'ok',
      msg: 'not logged in',
    })
  User.findById(userId)
    .then((user) => {
      if (!user)
        return res.status(400).json({
          status: 'error',
          msg: 'user not present in database',
        })
      return res.status(200).json({
        status: 'ok',
        msg: 'user profile fetched',
        profile: user.profile,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.patchEditProfile = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId)
    return res.status(401).json({
      status: 'ok',
      msg: 'not logged in',
    })

  const { profile } = req.body
  User.findById(userId)
    .then((user) => {
      if (!user)
        return res.status(400).json({
          status: 'error',
          msg: 'user not present in database',
        })

      user.profile = profile
      return user.save()
    })
    .then((user) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'user profile fetched',
        profile: user.profile,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.deleteUser = (req, res, next) => {
  const { userId } = req.body
  if (!userId)
    return res.status(404).json({
      status: 'error',
      msg: 'user not exist',
    })
  User.findByIdAndRemove(userId)
    .then((result) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'removed',
        result: result,
      })
    })
    .catch((err) => {
      next(err)
    })
}
