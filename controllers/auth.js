module.exports.getLogin = (req, res) => {
  return res.render('auth/login', {
    data: 'get login',
    path: '/auth/login',
  })
}

module.exports.postLogin = (req, res) => {
  return res.render('auth/login', {
    data: 'post-login',
  })
}

module.exports.getLogout = (req, res) => {
  return res.redirect('/')
}

module.exports.getSignup = (req, res) => {
  return res.render('auth/signup', {
    data: 'sign up',
    path: '/auth/signup',
  })
}

module.exports.postSignup = (req, res) => {
  return res.render('auth/signup', {
    data: 'post up',
  })
}
