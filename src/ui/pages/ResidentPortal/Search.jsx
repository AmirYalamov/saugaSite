import React from 'react'

import { Typography, Divider, TextField, Button, StandardInput, InputAdornment, FormControlLabel, Switch, LinearProgress, Grid } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import SearchCard from '../../components/SearchCard/SearchCard.jsx'

const axios = require('axios').default

const useStyles = makeStyles({
  page: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  leftPanel: {
    height: '100%',
    width: '270px',
    backgroundColor: '#F6F5FA',
    position: 'fixed',
    top: '60px',
    bottom: '0px',
    left: '0px',
    padding: '16px',
  },
  searchSection: {
    marginLeft: '302px',
    paddingTop: '32px',
    paddingLeft: '32px',
    width: 'calc(100% - 302px)'
  },
  searchHeader: {
    display: 'flex',
  },
  searchBox: {
    width: '700px',
    marginRight: '16px'
  },
  formControl: {
    width: '260px',
    marginTop: '16px',
  },
  filter: {
    margin: '26px 0',
    width: '100%',
  },
  switch: {
    margin: '16px 0'
  },
  dark:{
    color: 'black'
  },
  noEventsFound: {
    textAlign: 'center',
    width: '100%',
    marginTop: '32px',
  },
  searchResults: {
    overflowY: 'scroll',
    paddingLeft: '16px',
  }
})

export default function Search(props){
  const classes = useStyles()

  const [searchQuery, setSearchQuery] =  React.useState('')
  const [showFullEvents, setShowFullEvents] = React.useState(false)
  const [locationFilter, setLocationFilter] = React.useState('null')
  const [eventTypeFilter, setEventTypeFilter] = React.useState('null')
  const [locations, setLocations] = React.useState([])
  const [eventTypes, setEventTypes] = React.useState([])

  const [displayedEvents, setDisplayedEvents] = React.useState([])

  React.useEffect(()=>{

    var element = document.getElementById("searchResults")
    const height = window.innerHeight - 141

    element.style.height = `${height}px`

  },[])

  React.useEffect(() => {
    // Read locations and event Types
    axios.get('/v1/locations').then((response) =>{
      setLocations(response.data)
    }).catch(e => console.log(e))
    axios.get('/v1/event_types').then((response) =>{
      setEventTypes(response.data)
    }).catch(e => console.log(e))
  }, [])

  React.useEffect(()=>{

    var query = {
      s: searchQuery,
      lf: locationFilter,
      tf: eventTypeFilter
    }

    axios.get('/v1/search', { params: query })
    .then((response) => {
      console.log(response.data)
      setDisplayedEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })


  }, [searchQuery, locationFilter, eventTypeFilter])

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value)
  }


  const handleEventTypeChange = (event) => {
    setEventTypeFilter(event.target.value)
  }

  return(<div className={classes.page}>
      <div className={classes.leftPanel}>
        <Typography variant='h4' component='h4'>Filters</Typography>
        <Divider />
        <FormControlLabel
         control={
           <Switch
             checked={showFullEvents}
             onChange={(e)=>{setShowFullEvents(e.target.checked)}}
             color="primary"
             className={classes.switch}
           />
         }
         label="Show Full Events"
        />

        <Divider className={classes.dark}/>

        <FormControl className={classes.formControl}>
          <InputLabel id="locationFilter" className={classes.dark}>Location</InputLabel>
          <Select
            labelId="locationFilter"
            id="selectLocation"
            value={locationFilter}
            onChange={handleLocationChange}
            className={classes.filter}
            variant='outlined'
          >
            <MenuItem key={'fsa'} value='null'>Any</MenuItem>
            {locations.map((l, i) =>
              <MenuItem value={l._id} key={i}> {l.name} </MenuItem>
            )}
          </Select>
        </FormControl>

        <Divider/>

        <FormControl className={classes.formControl}>
          <InputLabel id="eventTypeFilter" className={classes.dark}>Event Type</InputLabel>
          <Select
            labelId="eventTypeFilter"
            id="selectEventType"
            value={eventTypeFilter}
            onChange={handleEventTypeChange}
            className={classes.filter}
            variant='outlined'
          >
            <MenuItem key={'asf'} value='null'>Any</MenuItem>
            {eventTypes.map((t, i) =>
              <MenuItem key={i} value={t._id}> {t.name} </MenuItem>
            )}
          </Select>
        </FormControl>

      </div>

      <div className={classes.searchSection}>
        <div className={classes.searchHeader}>
          <TextField
            className={classes.searchBox}
            value={searchQuery}
            onChange={handleQueryChange}
            label='Search'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button  variant='contained' color='primary'>Go</Button>
        </div>

        <Grid container id="searchResults" className={classes.searchResults}>
            {displayedEvents.length == 0 ? <Typography className={classes.noEventsFound}>No events found. Try changing your search criteria.</Typography> : null}
            {displayedEvents.map((eventData, i) => {
              return <SearchCard eventData={eventData} key={i} />
            })}
        </Grid>
      </div>
  </div>)

}
