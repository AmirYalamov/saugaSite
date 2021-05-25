const mongoose = require('mongoose')


// Create Schema
const EventTypeSchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  { strict: false }
)

module.exports = EventTypes = mongoose.model('event_types', EventTypeSchema)
