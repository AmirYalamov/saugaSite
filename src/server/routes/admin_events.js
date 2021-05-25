
const isAuth = require('../middleware/user_auth.js')
const Users = require('../models/Users.js')
const Events = require('../models/Events.js')
const EventTypes = require('../models/EventTypes.js')
const Locations = require('../models/Locations.js')
const MyEvents = require('../models/MyEvents.js')
const util = require('../../helpers/utilities.js')

module.exports = function (app) {

  var opts = [
    { path: 'event_type', model: 'event_types' },
    { path: 'location', model: 'locations' },
  ]

  // return a specific event, also returns with property for spots available
  app.get('/v1/events/:id', function(req, res) {

    const id = req.params.id

    var opts = [
      { path: 'event_type', model: 'event_types' },
      { path: 'location', model: 'locations' },
    ]

    Events.findById(id).populate(opts).exec((error, curr_event) => {

      if(error){
        console.log('an error occured')
      }
      if(!curr_event){
        console.log('no event found')
        return res.status(404).json({code: 404, message: 'No event found.'})
      }

      var returnEvent = JSON.parse(JSON.stringify(curr_event))

      returnEvent['startDateLabel'] = util.dateString(new Date(returnEvent.start_date))
      returnEvent['endDateLabel'] = util.dateString(new Date(returnEvent.end_date))

      MyEvents.find({event: curr_event._id, registered: true}, (me_error, events) => {

        const signups = events.length

        returnEvent['spots_available'] = returnEvent['capacity'] - signups

        return res.status(200).json(returnEvent)

      })

    })

  })

  // returns all events
  app.get('/v1/events', (req, res) => {

    var opts = [
      { path: 'event_type', model: 'event_types' },
      { path: 'location', model: 'locations' },
    ]

    Events.find({}).populate(opts).exec((error, events) => {
      if(error){
        console.log('an error occured')
      }
      if(!events){
        console.log('no events found')
        return res.status(404).json({code: 404, message: 'No event found.'})
      }

      var returnEvents = JSON.parse(JSON.stringify(events))

      for(var c=0; c<returnEvents.length; c++){
        returnEvents[c]['startDateLabel'] = util.dateString(new Date(returnEvents[c].start_date))
        returnEvents[c]['endDateLabel'] = util.dateString(new Date(returnEvents[c].end_date))
      }

      return res.status(200).json(returnEvents)

    })

  })

  // creates a new event
  app.post('/v1/events', (req, res) => {

    const body = req.body

    Events.create(body, (error, new_event) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      return res.status(200).json(new_event)
    })


  })

  // updates specified event
  app.patch('/v1/events/:id', (req, res) => {

    const updates = req.body

    Events.findByIdAndUpdate(req.params.id, updates, {new: true}, (error, updated_event) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      return res.status(200).json(updated_event)
    })


  })

  // deletes specified event
  app.delete('/v1/events/:id', (req, res) => {

    Events.findByIdAndDelete(req.params.id, (error, deleted_event) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      return res.status(200).json(deleted_event)
    })


  })

}
