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

  // search up an event(s) based on the name and/or event and/or location
  app.get('/v1/search', (req, res) => {

    // req.query is used mostly for searching, sorting, filtering, etc.
    // req.query gets parameters from the URL, i.e. req.query.s would get the value for "s=" in a URL
    const stringQuery = req.query.s
    const typeFilter = req.query.tf
    const locationFilter = req.query.lf

    var query = {
      location: locationFilter,
      event_type: typeFilter,
      name: { $regex: `${stringQuery}`, $options: "i" },
      start_date: { $gt: new Date().getTime() }
    }

    // in case no location or event type were entered when searching for event(s)
    if(query.location == 'null'){
      delete query.location
    }
    if(query.event_type == 'null'){
      delete query.event_type
    }

    Events.find(query).populate(opts).exec((error, events) => {
      if(error){
        console.log(error)
        return res.status(500).json({code: 500, message: 'Something went wrong.'})
      }

      var returnEvents = JSON.parse(JSON.stringify(events))

      for(var c=0; c<returnEvents.length; c++){
        returnEvents[c]['startDateLabel'] = util.dateString(new Date(returnEvents[c].start_date))
        returnEvents[c]['endDateLabel'] = util.dateString(new Date(returnEvents[c].end_date))
      }

      return res.status(200).json(returnEvents)

    })

  })

}
