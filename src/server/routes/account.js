const isAuth = require('../middleware/user_auth.js')
const Users = require('../models/Users.js')
const util = require('../../helpers/utilities.js')
const bcrypt = require('bcryptjs')

module.exports = function (app) {

  // returns a user based on request's ID
  app.get('/v1/account',
    isAuth,
    (req, res) => {
      Users.findById(req.user._id, (error, user) => {
        if (error) {
          console.log(error)
          return res.status(500).json({ code: 500, message: 'Something went wrong.', error: error })
        }
        if (!user) {
          return res.status(404).json({ code: 404, message: 'Could not find user.' })
        }

        const clean_user = JSON.parse(JSON.stringify(user))

        delete clean_user.password
        delete clean_user.third_party_auth

        return res.status(200).json(clean_user)
      })
    })

  // update username of a user
  app.patch('/v1/account/username',
    isAuth,
    (req, res) => {
      if (req.body.username == null) {
        return res.status(400).json({ code: 400, message: 'Request must include a username.' })
      }

      if (!(req.body.username.length >= 3)) {
        return res.status(422).json({ code: 422, message: 'Username must be atleast three characters long.' })
      }

      if (!util.isAlphaNumeric(req.body.username)) {
        return res.status(422).json({ code: 422, message: 'Username can only contain letters and numbers.' })
      }

      const updates = req.body
      updates._id = req.user._id

      Users.findOne(updates, (search_error, search_user) => {
        if (search_error) {

        }
        if (search_user) {
          return res.status(409).json({ code: 409, message: 'Username already taken.' })
        }

        Users.findByIdAndUpdate(req.user._id, updates, { new: true }, (error, user) => {
          if (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: 'Something went wrong.', error: error })
          }
          if (!user) {
            return res.status(404).json({ code: 404, message: 'Could not find user.' })
          }

          const clean_user = JSON.parse(JSON.stringify(user))

          delete clean_user.password
          delete clean_user.third_party_auth

          return res.status(200).json(clean_user)
        })
      })
    })

  // update password of a user
  app.patch('/v1/account/password',
    isAuth,
    (req, res) => {
      const password = req.body.password
      const new_password = req.body.new_password

      if (password == null) {
        return res.status(400).json({ code: 400, message: 'Request must include an old password.' })
      }
      if (new_password == null) {
        return res.status(400).json({ code: 400, message: 'Request must include a new password.' })
      }

      if (!(new_password.length >= 8)) {
        return res.status(422).json({ code: 422, message: 'New password must be at least 8 characters long.' })
      }

      Users.findById(req.user._id, (error, user) => {
        if (error) {
          console.log(error)
          return res.status(500).json({ code: 500, message: 'Something went wrong.', error: error })
        }
        if (!user) {
          return res.status(404).json({ code: 404, message: 'Could not find user.' })
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err

          if (isMatch) {
            // update password
            user.password = new_password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err
                user.password = hash
                user
                  .save()
                  .then(user => {
                    return res.status(200).json({ code: 200, message: 'Password updated.' })
                  })
                  .catch(err => {
                    return res.status(500).json({ code: 403, message: 'Password is incorrect.' })
                  })
              })
            })
          } else {
            return res.status(403).json({ code: 403, message: 'Old password is incorrect.' })
          }
        })
      })
    })

  // update email or phone number or any other credential that does not require validation
  app.patch('/v1/account',
    isAuth,
    (req, res) => {
      const updates = req.body
      delete updates.password
      delete updates.third_party_auth
      delete updates.roles
      delete updates.organization
      delete updates.referral_code
      delete updates.referred_by
      delete updates.email_is_verified

      if (updates.email) {
        if (!util.isEmail(updates.email)) {
          return res.status(422).json({ code: 422, message: 'Email is invalid.' })
        }
      }

      if (updates.phone_number) {
        if (!util.isNumber(updates.phone_number)) {
          return res.status(422).json({ code: 422, message: 'Phone number is invalid.' })
        }
      }

      Users.findByIdAndUpdate(req.user._id, updates, { new: true }, (error, user) => {
        if (error) {
          console.log(error)
          return res.status(500).json({ code: 500, message: 'Something went wrong.', error: error })
        }
        if (!user) {
          return res.status(404).json({ code: 404, message: 'Could not find user.' })
        }

        const clean_user = JSON.parse(JSON.stringify(user))

        delete clean_user.password
        delete clean_user.third_party_auth

        return res.status(200).json(clean_user)
      })
    })
}
