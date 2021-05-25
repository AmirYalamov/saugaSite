const passport = require('passport')
const isAuth = require('../middleware/user_auth.js')
const ObjectId = require('mongoose').Types.ObjectId

const Users = require('../models/Users.js')

const util = require('../../helpers/utilities.js')

module.exports = function (app) {

  // PATCH is basically "update"
  app.patch('/v1/user/:id', (req, res) => {

    Users.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}, (error, user) => {
      if(error){
        console.log(error)
        return res.status(500).json({})
      }

      return res.status(200).json({})
    })

  })

}
