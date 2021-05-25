const userAuth = require('./user_auth')
const account = require('./account.js')
const event_routes = require('./events.js')
const admin_event_type_routes = require('./admin_event_types.js')
const admin_location_routes = require('./admin_locations.js')
const admin_event_routes = require('./admin_events.js')

const users = require('./users.js')
const search = require('./search.js')

const my_events = require('./my_events.js')


module.exports = function (app) {

  userAuth(app)
  event_routes(app)
  users(app)
  my_events(app)
  //admin routes
  admin_event_type_routes(app)
  admin_location_routes(app)
  admin_event_routes(app)
  account(app)
  search(app)

}
