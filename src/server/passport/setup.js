const bcrypt = require('bcryptjs')
const User = require('../models/Users')
const passport = require('passport')    // authentication middleware for Node.js
const LocalStrategy = require('passport-local').Strategy
const ObjectId = require('mongoose').Types.ObjectId

const util = require('../../helpers/utilities.js')

// after initial session being established, subsequent logins will use serialized (converting object state into a format that can be transmitted or stored) user isntances
// only user ID is serialized
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Local Strategy (what passport uses for request authentication)
passport.use(
  new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    console.log(username)
    console.log(password)
    // Match User
    User.findOne({ username: username.toLowerCase() })
      .then(user => {
        // Create new User
        if (!user) {
          const userObject = { username: username.toLowerCase(), password: password}
          if (util.isEmail(username)) {
            userObject.email = username.toLowerCase()
          }
          userObject.created_at = Date.now()

          const newUser = new User(userObject)
          // Hash password before saving in database
          // a salt is a random string to be added to password before hashing
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash
              newUser
                .save()
                .then(user => {
                  return done(null, user)
                })
                .catch(err => {
                  return done(null, false, { message: err })
                })
            })
          })
          // Return other user
        } else {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Password is incorrect.' })
            }
          })
        }
      })
      .catch(err => {
        return done(null, false, { message: err })
      })
  })
)

module.exports = passport
