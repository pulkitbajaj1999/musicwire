module.exports = (req, res, next) => {
  return res.render('test', {
    data: '404-not-found',
  })
}
