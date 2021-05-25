const isAuth = require('../middleware/user_auth.js')
const Users = require('../models/Users.js')
const MyEvents = require('../models/MyEvents.js')
const util = require('../../helpers/utilities.js')

module.exports = function (app) {

  // returns specific event based on inputted ID
  app.get('/v1/my_events/:id',
  isAuth,
  (req, res) => {

    var opts = [
      { path: 'event', model: 'events', populate: [
          { path: 'event_type', model: 'event_types' },
          { path: 'location', model: 'locations' },
        ]
      },
    ]

    // check to see if queried event based on event id and user id matches desired event
    MyEvents.findOne({event: req.params.id, user: req.user._id}).populate(opts).exec((error, myEvent) => {
      if(error){
        return res.status(500).json({error: error})
      }
      if(!myEvent){
        return res.status(404).json({code: 404, message: 'My event does not exist.'})
      }

      var returnEvent = JSON.parse(JSON.stringify(myEvent))

      returnEvent.event['startDateLabel'] = util.dateString(new Date(returnEvent.event.start_date))
      returnEvent.event['endDateLabel'] = util.dateString(new Date(returnEvent.event.end_date))

      return res.status(200).json(returnEvent)
    })

  })

  // returns list of all my_events
  app.get('/v1/my_events',
  isAuth,
  (req, res) => {

    var opts = [
      { path: 'event', model: 'events', populate: [
          { path: 'event_type', model: 'event_types' },
          { path: 'location', model: 'locations' },
        ]
      }
    ]

    MyEvents.find({user: req.user._id}).populate(opts).exec((error, events) => {
      if(error){
        return res.status(500).json({error: error})
      }

      var returnEvents = JSON.parse(JSON.stringify(events))

      for(var e=0; e<returnEvents.length; e++){
        returnEvents[e].event['startDateLabel'] = util.dateString(new Date(returnEvents[e].event.start_date))
        returnEvents[e].event['endDateLabel'] = util.dateString(new Date(returnEvents[e].event.end_date))
      }

      return res.status(200).json(returnEvents)
    })
  })

  app.patch('/v1/my_events/:id',
  isAuth,
  (req, res) => {

    MyEvents.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, doc) {
      if (err) return res.status(500).json({error: err})

      return res.status(200).json(doc)
    })

  })

  app.put('/v1/my_events',
  isAuth,
  (req, res) => {

    var query = {event: req.body.event, user: req.user._id}

    var object = JSON.parse(JSON.stringify(req.body))

    object['user'] = req.user._id

    MyEvents.findOneAndUpdate(query, object, {upsert: true, new: true}, function(err, doc) {
        if (err) return res.status(500).json({error: err})

        return res.status(200).json(doc)

    })

  })


}
