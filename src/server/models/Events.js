const mongoose = require('mongoose')


// Create Schema
const EventSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Locations' },
    event_type: { type: mongoose.Schema.Types.ObjectId, ref: 'EventTypes' },
    start_date: { type: Date },
    end_date: { type: Date },
    image_url: { type: String },
    capacity: { type: Number },
  },
  { strict: false }
)

module.exports = Events = mongoose.model('events', EventSchema)
