const isAuth = require('../middleware/user_auth.js')
const Users = require('../models/Users.js')
const EventTypes = require('../models/EventTypes.js')

module.exports = function (app) {

    // find a specific event type on admin side based on inputted ID
    app.get('/v1/event_types/:id', function(req, res) {

      const id = req.params.id

      EventTypes.findById(id, (error, curr_event) => {

        if(error){
          console.log('an error occured')
        }
        if(!curr_event){
          console.log('no event found')
          return res.status(404).json({code: 404, message: 'No event found.'})
        }

        return res.status(200).json(curr_event)

      })

    })

    // find all event types
    app.get('/v1/event_types', function(req, res) {

      EventTypes.find({}, (error, events) => {

        if(error){
          console.log('an error occured')
        }
        if(!events){
          console.log('no event found')
          return res.status(404).json({code: 404, message: 'No event found.'})
        }

        return res.status(200).json(events)

      })

    })

    // allows admin to create an event type
    app.post('/v1/event_types', function(req, res) {

      const body = req.body

      EventTypes.create(body, function(error, event_types) {
        return res.status(200).json(event_types)
      })

    })

    // allows admin to delete a specific event 
    app.delete('/v1/event_types/:id', (req, res) => {

      EventTypes.findByIdAndDelete(req.params.id, (error, deleted) => {
        if(error){
          console.log(error)
          return res.status(500).json({code: 500, message: 'Something went wrong.'})
        }
        return res.status(200).json({message: 'deleted'})
      })

    })

}
