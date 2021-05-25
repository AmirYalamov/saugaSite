import React, { forwardRef } from 'react'

import { Button, TextField, Grid, Typography, Paper, Slide } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { Delete } from '@material-ui/icons'

const axios = require('axios').default

import { tableIcons } from '../../components/TableIcons/TableIcons.jsx'

import AddressSearch from '../../components/AddressSearch/AddressSearch.jsx'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'


const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '30px',
    color: '#000000',
    marginTop: '36px',
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    color: '#000000',
    opacity: '0.54',
    marginTop: '10px',
    marginBottom: '18px',
  },
  addButton: {
    marginRight: '32px',
  },
  optionsLoading: {
    width: '18px',
    height: '18px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  tableContainer: {
    marginLeft: '32px',
    marginRight: '32px',
  },
  verticalMargin: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  bottomBar: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    borderTop: '1px solid #C7C7C7',
    paddingTop: '16px',
    paddingBottom: '16px',
    zIndex: '1000',
    backgroundColor: '#fff'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  buttonSpacing: {
    marginLeft: '12px',
  },
  marginLeft: {
    marginLeft: '8px',
  },
  marginRight: {
    marginRight: '8px'
  },
  contentContainer: {
    paddingBottom: '96px',
  },
  fullWidth: {
    width: '100%',
  },
  dateBoxWidth: {
    width: 'calc(100% + 8px)'
  },

}))

export default function Locations(props){
  const classes = useStyles()

  const [dialog, setDialog] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [eventType, setEventType] = React.useState('')
  const [startDate, setStartDate] = React.useState()
  const [endDate, setEndDate] = React.useState()
  const [capacity, setCapacty] = React.useState('1')

  const [locations, setLocations] = React.useState([])
  const [eventTypes, setEventTypes] = React.useState([])

  const [eventTypeName, setEventTypeName] = React.useState('')
  const [locationName, setLocationName] = React.useState('')

  const [date, setDate] = React.useState(Date.now())
  const [startTime, setStartTime] = React.useState(Date.now())
  const [endTime, setEndTime] = React.useState(Date.now())

  //error handlding
  const [capacityError, setCapacityError] = React.useState(false)
  const [timeError, setTimeError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  var open = props.open

  React.useEffect(()=>{

    open = props.open

  },[props.open])

  React.useEffect(()=>{

    axios.all([getLocations(), getEventTypes()])
    .then(axios.spread((locationData, eventTypeData) => {
      setLocations(locationData.data)
      setEventTypes(eventTypeData.data)
    }))
    .catch((error) => {
      console.log(error)
    })

  },[])

  const getLocations = () => {
    return axios.get('/v1/locations')
  }

  const getEventTypes = () => {
    return axios.get('/v1/event_types')
  }

  const saveAndContinue = (e) => {

    e.preventDefault()

    // capacity can't be negative or zero
    if (capacity <= 0) {
      setCapacityError(true)
      setTimeError(false)
      setErrorMessage("Capacity must be greater than 0")
      return
    }

    // date validation
    console.log(startTime, endTime)
    if (endTime <= startTime) {
      setTimeError(true)
      setCapacityError(false)
      setErrorMessage("End time must be after the start time")
      return
    }

    const body = {
      name: name,
      description: description,
      location: location._id,
      event_type: eventType._id,
      start_date: startTime,
      end_date: endTime,
      image_url: 'https://www.cp24.com/polopoly_fs/1.5001124.1593179801!/httpImage/image.jpg_gen/derivatives/landscape_960/image.jpg',
      capacity: capacity,
      date
    }

    axios.post('/v1/events', body)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      handleClose()
      props.updateState()
    })

  }

  const handleClose = () => {
    props.setOpen(false)
    setName('')
    setDescription('')
    setLocation('')
    setEventType('')
    setStartDate()
    setEndDate()
    setCapacty('1')
    setEventTypeName('')
    setLocationName('')
    setDate(Date.now())
    setStartTime(Date.now())
    setEndTime(Date.now())
  }

  const discard = () => {
    handleClose()
  }

  const handleDateChange = (date) => {
    setDate(date)
    setStartTime(date)
    setEndTime(date)
  }

  const handleStartChange = (date) => {
    setStartTime(date)
  }

  const handleEndChange = (date) => {
    setEndTime(date)
  }


  return(

    <Dialog className={classes.dialog} fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>

      <form onSubmit={saveAndContinue}>
      <Grid container
        direction='row'
        justify='center'
        alignItems='center'
        className={classes.contentContainer}
      >
        <Grid item xs={8} >
          <Typography className={classes.title}>Basic Info</Typography>
          <Typography className={classes.description}>Name your event and tell event-goers why they should come. Add details that highlight what makes it unique.</Typography>
        </Grid>
        <Grid item xs={8} >
          <TextField
            autoFocus
            value={name}
            onChange={(e)=>{setName(e.target.value)}}
            label='Name'
            type='text'
            fullWidth
            variant='outlined'
            className={classes.verticalMargin}
            autoComplete='off'
            required
          />
        </Grid>
        <Grid item xs={8} >
          <TextField
            autoFocus
            value={description}
            onChange={(e)=>{setDescription(e.target.value)}}
            label='Description'
            type='text'
            fullWidth
            variant='outlined'
            className={classes.verticalMargin}
            multiline
            rows={2}
            required
          />
        </Grid>
        <Grid item xs={8} >
          <Grid container>
            <Grid item xs={6}>
              <Autocomplete
                options={eventTypes}
                className={classes.verticalMargin}
                label='Event Type'
                inputProps={{
                  form: {
                    autocomplete: 'off',
                  },
                }}
                getOptionLabel={(option) => option.name}
                inputValue={eventTypeName}
                onChange={(e,v) => {setEventType(v); setEventTypeName( v ? v.name : '')}}
                fullWidth
                renderInput={(params) => (
                  <TextField required {...params} label="Event Type" onChange={({ target }) => setEventType(target.value)} variant="outlined" fullWidth />
                )}
                required

              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                value={capacity}
                onChange={(e)=>{setCapacty(e.target.value)}}
                label='Capacity'
                type='text'
                fullWidth
                variant='outlined'
                className={`${classes.verticalMargin} ${classes.marginLeft}`}
                helperText={'Enter the number of people who can attend'}
                error={capacityError}
                helperText={capacityError ? errorMessage : null}
                required
              />
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <Typography className={classes.title}>Location</Typography>
            <Typography className={classes.description}>Help people in the area discover your event and let attendees know where to show up.</Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={locations}
              className={classes.verticalMargin}
              label='Locations'
              inputProps={{
                form: {
                  autocomplete: 'off',
                },
              }}
              getOptionLabel={(option) => option.name}
              inputValue={locationName}
              onChange={(e,v) => {setLocation(v); setLocationName( v ? v.name : '')}}
              fullWidth
              className={classes.widthFull}
              renderInput={(params) => (
                <TextField {...params} required label="Locations" onChange={({ target }) => setLocationName(target.value)} variant="outlined" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} >
            <Typography className={classes.title}>Date and Time</Typography>
            <Typography className={classes.description}>When you do want your event to take place?</Typography>
          </Grid>
          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container className={classes.widthFull}>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    margin='normal'
                    name='Date'
                    id='date-picker-dialog'
                    label='Date picker dialog'
                    format='MM/dd/yyyy'
                    value={date}
                    onChange={handleDateChange}
                    fullWidth
                    variant='contained'
                    className={classes.dateBoxWidth}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <KeyboardTimePicker
                    margin='normal'
                    id='time-picker'
                    label='Start Time'
                    value={startTime}
                    onChange={handleStartChange}
                    fullWidth
                    variant='contained'
                    className={`${classes.marginRight}`}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <KeyboardTimePicker
                    fullWidth
                    margin='normal'
                    id='time-picker'
                    label='End Time'
                    value={endTime}
                    onChange={handleEndChange}
                    error={timeError}
                    helperText={timeError ? errorMessage : null}
                    variant='contained'
                    className={`${classes.marginLeft}`}
                    required
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Grid>

      <div className={classes.bottomBar}>
      <Grid container
        direction='row'
        justify='center'
        alignItems='center'
      >
        <Grid item xs={8} >
          <div className={classes.actionButtons}>
            <Button className={classes.buttonSpacing} onClick={discard} variant='outlined'>Discard</Button>
            <Button className={classes.buttonSpacing} type='submit' color='primary' variant='contained'>Save & Continue</Button>
          </div>
        </Grid>
      </Grid>
      </div>
      </form>
    </Dialog>
  )

}
