
const isAuth = require('../middleware/user_auth.js')
const Users = require('../models/Users.js')
const Locations = require('../models/Locations.js')
const Events = require('../models/Events.js')
const util = require('../../helpers/utilities.js')


module.exports = function (app) {

  // returns events at a specified location
  app.get('/v1/locations/:id/events', function(req, res) {

    const id = req.params.id

    var opts = [
      { path: 'event_type', model: 'event_types' },
      { path: 'location', model: 'locations' },
    ]

    Events.find({location: id}).populate(opts).exec((error, events) => {

      if(error){
        console.log('an error occured')
      }
      if(!events){
        console.log('No events found')
        return res.status(404).json({code: 404, message: 'No events found.'})
      }

      var returnEvents = JSON.parse(JSON.stringify(events))

      for(var c=0; c<returnEvents.length; c++){
        returnEvents[c]['startDateLabel'] = util.dateString(new Date(returnEvents[c].start_date))
        returnEvents[c]['endDateLabel'] = util.dateString(new Date(returnEvents[c].end_date))
      }

      return res.status(200).json(returnEvents)

    })

  })

  // returns a specific location based on ID
  app.get('/v1/locations/:id', function(req, res) {

    const id = req.params.id

    Locations.findById(id, (error, location) => {

      if(error){
        console.log('an error occured')
      }
      if(!location){
        console.log('no location found')
        return res.status(404).json({code: 404, message: 'No location found.'})
      }

      return res.status(200).json(location)

    })

  })

  // returns all locations
  app.get('/v1/locations', (req, res) => {

    Locations.find({}, (error, events) => {
      if(error){
        console.log('an error occured')
      }
      if(!events){
        console.log('no locations found')
        return res.status(404).json({code: 404, message: 'No locations found.'})
      }

      return res.status(200).json(events)

    })

  })

  // creates a new location
  app.post('/v1/locations', (req, res) => {

    const body = req.body

    Locations.create(body, (error, new_location) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      return res.status(200).json(new_location)
    })


  })

  // delete a specific location
  app.delete('/v1/locations/:id', (req, res) => {

    Locations.findByIdAndDelete(req.params.id, (error, deleted_location) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      return res.status(200).json(deleted_location)
    })


  })

  // update existing location based on ID 
  app.patch('/v1/locations/:id', (req, res) => {

    const updates = req.body

    Locations.findByIdAndUpdate(req.params.id, updates, {new: true}, (error, updated_location) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      return res.status(200).json(updated_location)
    })


  })

}
