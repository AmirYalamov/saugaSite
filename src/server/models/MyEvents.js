const mongoose = require('mongoose')


// Create Schema
const MyEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Events' },
    book_marked: { type: Boolean },
    registered: { type: Boolean },
  },
  { strict: false }
)

module.exports = MyEvents = mongoose.model('my_events', MyEventSchema)
