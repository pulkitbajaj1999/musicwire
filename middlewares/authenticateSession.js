module.exports = (req, res, next) => {
  console.log('session:', req.session)
  req.isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false
  next()
}
