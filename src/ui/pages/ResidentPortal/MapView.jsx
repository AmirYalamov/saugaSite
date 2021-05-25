import React from 'react'

import { Typography, Divider } from '@material-ui/core'

import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'

const axios = require('axios').default

import MapListItem from '../../components/MapListItem/MapListItem.jsx'

const useStyles = makeStyles({
  mapPage: {
    position: 'fixed',
    top: '60px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    transition: 'all 0.2s ease',
  },
  mapArea:{
    height: '100%',
    marginTop: '12px',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  sideBar: {
    position: 'fixed',
    width: '270px',
    top: '60px',
    left: '0px',
    bottom: '0px',
    transition: 'all 0.2s ease',
    opacity: '0.9',
    backgroundColor: 'white',
    zIndex: '100',
    overflow: 'hidden',
  },
  sideBarHidden: {
    width: '0px !important',
  },
  fullScreen: {
    left: '0px !important',
  },
  openSide: {
    zIndex: '1000',
    position: 'fixed',
    top: '50%',
    left: '8px',
    transition: 'all 0.2s ease',
  },
  openSideIsOpen: {
    left: '278px',
  },
  locationTitle: {
    padding: '16px',
    paddingTop: '32px',
    fontSize: '24px',
  },
  eventList: {
    overflow: 'scroll',
    height: '80%',
    paddingBottom: '100px',
  },
  mapInstruction: {
    padding: '16px',
    textAlign: 'center',
  }
})

export default function Map(props){
  const classes = useStyles()

  const [map, _setMap] = React.useState()
  const mapRef = React.useRef(map)
  const setMap = data => {
    mapRef.current = data
    _setMap(data)
  }
  const [mapLoaded, setMapLoaded] = React.useState(false)

  const [hideSide, setHideSide] = React.useState(true)
  const [locations, setLocations] = React.useState([])
  const [events, setEvents] = React.useState([])

  const [currentLocation, setCurrentLocation] = React.useState({})

  React.useEffect(()=>{

    var map = new mapkit.Map('map', {
      showsUserLocation: false,
      tracksUserLocation: false,
      showsUserLocationControl: false,
      showsPointsOfInterest: false,
      region: new mapkit.CoordinateRegion(new mapkit.Coordinate(43.6041808,-79.7587182), new mapkit.CoordinateSpan(0.4, 0.4)),
    })

    setMap(map)
    setMapLoaded(true)

    axios.get('/v1/locations')
    .then((response) => {
      setLocations(response.data)

      //add locations to the map here
      var locs = JSON.parse(JSON.stringify(response.data))

      locs = locs.map((item, index) => {

        var this_coordinate = new mapkit.Coordinate(item.address.coordinate.latitude, item.address.coordinate.longitude)

        var annotation = new mapkit.MarkerAnnotation(this_coordinate, {
          color: '#c969e0',
          animates: false
        })
        annotation.data = item
        return annotation
      })

      console.log(locs)

      map.showItems(locs)

      // Show info about the selected state.
      mapRef.current.addEventListener('select', (event) => {
        if(event && event.target && event.target.selectedAnnotation && event.target.selectedAnnotation.data){
          const locData = event.target.selectedAnnotation.data
          console.log(locData)
          openLocation(locData)
        }
      })

      mapRef.current.addEventListener('deselect', (event) => {
        setCurrentLocation({})
        setHideSide(true)
        setEvents([])
      })

    })
    .catch((error) => {
      console.log(error)
    })

  }, [])

  const openLocation = (loc) => {

    setCurrentLocation(loc)
    setHideSide(false)

    axios.get('/v1/locations/'+loc._id+'/events')
    .then((response) => {
      console.log(response.data)
      setEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  }


  return(<React.Fragment>
    <div className={`${classes.sideBar} ${hideSide ? classes.sideBarHidden : null}`}>
      <Typography className={classes.locationTitle}>{currentLocation.name}</Typography>
      <Divider />
      {events.length == 0 && currentLocation._id ? <Typography className={classes.mapInstruction}>There are no future events at this location.</Typography> :
      <div className={classes.eventList}>
        {!currentLocation._id ? <Typography className={classes.mapInstruction}>Click a map pin to load events for that location</Typography> : null}
        {events.map((item, index) => {
          return <MapListItem eventData={item} />
        })}
      </div>
      }

    </div>
    <div className={`${classes.openSide} ${!hideSide ? classes.openSideIsOpen : null}`}>
      {hideSide ? <ArrowForwardIos onClick={()=>{setHideSide(false)}} /> : <ArrowBackIos onClick={()=>{setHideSide(true)}} /> }
    </div>
    <div className={`${classes.mapPage}  ${hideSide ? classes.fullScreen : null}`}>

      <div id='map' className={`${classes.map}`}></div>
    </div>
  </React.Fragment>)

}
