const mongoose = require('mongoose')


// Create Schema
const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String
    },
    email: {
      type: String
    },
    phone_number: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email_is_verified: {
      type: Boolean,
      default: true
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    admin: { type: Boolean, default: false },
    type: { type: String, default: 'resident', enum: ['resident', 'admin'] }

  },
  { strict: true }
)

module.exports = Users = mongoose.model('users', UserSchema)
