const passport = require('passport')
const isAuth = require('../middleware/user_auth.js')
const ObjectId = require('mongoose').Types.ObjectId

const Users = require('../models/Users.js')

const util = require('../../helpers/utilities.js')

module.exports = function (app) {
  app.get('/v1/logout',
    isAuth,
    function (req, res) {
      console.log('logout: \n' + req.user)

      req.logout()
      res.status(200).json({ success: true })
    })

  // removes password before sending data to front end, for security good practice
  app.get('/v1/login', isAuth, (req, res) => {
    const user = JSON.parse(JSON.stringify(req.user))

    const clean_user = JSON.parse(JSON.stringify(user))

    delete clean_user.password

    return res.status(200).json(clean_user)
  })

  // neccessary to authenticate user when logging in
  app.post('/v1/login',
    function (req, res, next) {
      const username = req.body.username.toLowerCase()
      const password = req.body.password

      Users.findOne({ username: { $eq: username } }, (error, user) => {
        if (error) {
          return res.status(500).json({ code: 500, message: 'Something went wrong.' })
        }
        if (!user) {
          return res.status(404).json({ code: 404, message: 'Username does not exist.' })
        }
        next()
      })
    },
    passport.authenticate('local'),
    function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.send('/users/' + req.user.username)
      res.status(200).json(req.user)
    })

  // POST request to verify if email exists and therefore user exists in DB
  app.post('/v1/users/email_exists', (req, res) => {
    const { email } = req.body

    Users.findOne({ email: { $eq: email } }, (error, user) => {
      if (error) {
        return res.status(500).json({ code: 500, message: 'Something went wrong.', error: error })
      }
      if (user == null) {
        return res.status(200).json({ code: 200, exists: false, message: 'User does not exist.' })
      }

      return res.status(200).json({ code: 200, exists: true, message: 'User exists.' })
    })
  })

  app.post('/v1/register_login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return res.status(400).json({ errors: err })
      }
      if (!user) {
        return res.status(400).json({ errors: 'No user found' })
      }
      req.logIn(user, function (err) {
        if (err) {
          return res.status(400).json({ errors: err })
        }
        return res.status(200).json({ success: `logged in ${user.id}`, _id: user._id })
      })
    })(req, res, next)
  })
}
