module.exports = (req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false
  next()
}
