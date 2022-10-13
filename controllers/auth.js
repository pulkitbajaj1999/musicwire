const bcryptjs = require('bcryptjs')
const User = require('../models/user')

const GUEST_USER = {
  username: 'guest171112236',
  email: 'guest171112236@musicwire',
  password: '$2a$12$xfPpVI7xpM7vXyAXtQ0yg.d/OiIXdEnXkboAL4gIT4m/rX0C1B2F6',
}

module.exports.getLogin = (req, res) => {
  return res.render('auth/login', {
    data: 'get login',
    path: '/auth/login',
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
}

module.exports.postLogin = (req, res) => {
  const { username, password } = req.body
  // check if user with the given username exists
  User.findOne({ username: username }).then((user) => {
    // user exists
    if (user) {
      // compare the entered password against stored hash
      bcryptjs.compare(password, user.password).then((result) => {
        // password matches then initialize a session for the given user and revert to home page
        if (result === true) {
          req.session.user = { _id: user._id.toString() }
          req.session.isLoggedIn = true
          req.session.save((err) => {
            if (err) {
              console.log('Error while saving session!\n', err)
              res.render('500InternalServerError', {
                isLoggedIn: req.isLoggedIn,
                csrf_token: req.csrfToken(),
              })
            } else {
              res.redirect('/')
            }
          })
        }
        // password doesn't match then show dialog to user
        else {
          res.render('auth/login', {
            error_message: 'Password is Incorrect. Please check and try again!',
            isLoggedIn: req.isLoggedIn,
            csrf_token: req.csrfToken(),
          })
        }
      })
    }
    // if user does not exists show a dialog to user
    else {
      res.render('auth/login', {
        error_message: 'User does not exist. Please try again!',
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    }
  })
}

module.exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while destroying session!\n', err)
      res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    } else {
      res.redirect('/auth/login')
    }
  })
}

module.exports.getSignup = (req, res) => {
  return res.render('auth/signup', {
    data: 'sign up',
    path: '/auth/signup',
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
}

module.exports.postSignup = (req, res) => {
  const { username, email, password } = req.body
  if (!username || !password) {
    return res.render('auth/signup', {
      error_message: 'Invalid username or password!',
      isLoggedIn: req.isLoggedIn,
      csrf_token: req.csrfToken(),
    })
  }
  // check if user exists
  User.findOne({ username: username })
    .then((user) => {
      // if user exists responds with a dialog
      if (user) {
        res.render('auth/signup', {
          error_message: 'Username already taken, use another!',
          isLoggedIn: req.isLoggedIn,
          csrf_token: req.csrfToken(),
        })
      }
      // else create a new user in database with hashed password
      else {
        const newUser = new User({
          username: username,
        })
        if (email) newUser.email = email
        // generate a hash of password with salt-lenght of 12
        return bcryptjs.hash(password, 12).then((hashedPassword) => {
          newUser.password = hashedPassword
          return newUser.save()
        })
      }
    })
    // on successful signup redirect user to login page
    .then((newUser) => {
      console.log('User created...\n', newUser)
      res.redirect('/auth/login')
    })
    .catch((err) => {
      console.log('Error while creating user!\n', err)
      res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.postGuestLogin = (req, res) => {
  User.findOne({ username: 'guest171112236' })
    .then((guest) => {
      if (guest) {
        return guest
      } else {
        guest = new User({ ...GUEST_USER })
        return guest.save()
      }
    })
    .then((guest) => {
      console.log('User guest\n', guest)
      req.session.user = { _id: guest._id.toString() }
      req.session.isLoggedIn = true
      req.session.save((err) => {
        if (err) {
          console.log('Error while saving guest session!\n', err)
          res.render('500InternalServerError', {
            isLoggedIn: req.isLoggedIn,
            csrf_token: req.csrfToken(),
          })
        } else {
          res.redirect('/')
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}
