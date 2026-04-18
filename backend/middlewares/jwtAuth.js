// import modules
const jwt = require('jsonwebtoken')

// import models
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key'

module.exports.setAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader ? authHeader.split(' ')[1] : null

  // if token not provided then continue to next middleware
  if (!token) return next()

  // else verify token and extract user-info
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.exp <= Date.now() / 1000)
      return res
        .status(401)
        .json({ status: 'error', msg: 'Token has expired', action: 'LOGOUT' })

    const { userId } = decoded
    const user = await User.findById(userId).lean()
    if (!user) {
      return res.status(401).json({
        status: 'error',
        msg: 'userId not present in database extracted from jwt token',
        action: 'LOGOUT',
      })
    }
    if (user) {
      req.user = {
        _id: user._id,
        profile: user.profile,
        email: user.email,
        role: user.role,
      }
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      msg: 'error while verifying and extracting jwt token',
      err: err,
      action: 'LOGOUT',
    })
  }
  next()
}

// Check if the user has one of the required roles
module.exports.checkRole = (roles) => {
  return async (req, res, next) => {
    // Check if the user exists on the request object
    if (!req.user) {
      return res.status(401).send({ status: 'error', msg: 'Not authorized' })
    }
    // check user has role among the given
    if (!roles.includes(req.user.role)) {
      return res.status(401).send({ status: 'error', msg: 'Forbidden' })
    }
    // if meet all conditions then continue to next
    next()
  }
}

// module.exports.isAuth = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not logged in',
//     })
//   } else return next()
// }

// module.exports.isAdmin = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not logged in',
//     })
//   } else if (req.user.role !== 'admin') {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not authorized as admin',
//     })
//   } else {
//     next()
//   }
// }

// module.exports.isTeamOwner = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not logged in',
//     })
//   } else if (req.user.role !== 'owner') {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not authorized as team owner',
//     })
//   } else {
//     next()
//   }
// }

// module.exports.isPlayer = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not logged in',
//     })
//   } else if (req.user.role !== 'player') {
//     return res.status(401).json({
//       status: 'error',
//       msg: 'not authorized as player',
//     })
//   } else {
//     next()
//   }
// }
