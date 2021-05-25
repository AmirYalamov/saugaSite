const isAuth = require('../middleware/user_auth.js')
const Users = require('../models/Users.js')
const Events = require('../models/Events.js')
const EventTypes = require('../models/EventTypes.js')
const util = require('../../helpers/utilities.js')


module.exports = function (app) {

  app.get('/v1/discover_events', (req, res) => {

    var opts = [
      { path: 'event_type', model: 'event_types' },
      { path: 'location', model: 'locations' },
    ]

    EventTypes.find({}, (et_error, event_types) => {
      if(et_error){
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }
      Events.find({}).populate(opts).sort({'event_type.name': 1}).exec((error, events) => {
        if(error){
          return res.status(500).json({code: 500, message: 'Something went wrong.'})
        }

        var cleanEvents = JSON.parse(JSON.stringify(events))

        for(var c=0; c<cleanEvents.length; c++){
          cleanEvents[c]['startDateLabel'] = util.dateString(new Date(cleanEvents[c].start_date))
          cleanEvents[c]['endDateLabel'] = util.dateString(new Date(cleanEvents[c].end_date))
        }

        var sortedEvents = []

        // populate the event types for all sorted events
        for(var c=0; c<event_types.length; c++){
          // for each sorted events element, we have an event type, and a list of the events that are of that event type
          sortedEvents.push({event_type: event_types[c], events: []})
        }

        // populate the actual event itself for all sorted events
        for(var c=0; c<sortedEvents.length; c++){
          // for each sorted event type, add the appropriate event
          for(var e=0; e<cleanEvents.length; e++){
            if(cleanEvents[e].event_type && sortedEvents[c].event_type){
              if(cleanEvents[e].event_type._id.toString() == sortedEvents[c].event_type._id.toString()){
                sortedEvents[c].events.push(cleanEvents[e])
              }
            }
          }
        }

        return res.status(200).json(sortedEvents)

      })
    })

  })

}
