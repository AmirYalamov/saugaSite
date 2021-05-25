const mongoose = require('mongoose')


const CoordinateSchema = new mongoose.Schema({
  longitude: { type: Number },
  latitude: { type: Number}
})

const RegionSchema = new mongoose.Schema({
  center: {
    longitude: { type: Number },
    latitude: { type: Number }
  },
  span: {
    longitudeDelta: { type: Number },
    latitudeDelta: { type: Number }
  }
})

const AddressSchema = new mongoose.Schema({

  region: RegionSchema,
  coordinate: CoordinateSchema,
  formattedAddress: { type: String },
  countryCode: { type: String },
  geocodeAccuracy :  { type: String},
  name :  { type: String },
  urls : [String],
  country :  { type: String },
  administrativeArea :  { type: String },
  administrativeAreaCode :  { type: String },
  locality :  { type: String },
  timezone :  { type: String },
  timezoneSecondsFromGmt : { type: Number }

})

// Create Schema
const LocationSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    address: AddressSchema,

  },
  { strict: false }
)

module.exports = Locations = mongoose.model('locations', LocationSchema)
