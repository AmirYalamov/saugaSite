import React from 'react'

import { Typography, Button, Paper, LinearProgress, Link, Grid } from '@material-ui/core'

import { Link as RouterLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import UserContext from '../../contexts/UserContext.js'

import EventsTable from '../../components/EventsTable/EventsTable.jsx'

const axios = require('axios').default

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '60%',
    height: 'auto',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centerText: {
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    fontFamily: "'Roboto', sans-serif",
    marginTop: '10%',
  },
  description: {
    color: '#757575',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: "'Roboto', sans-serif",
    marginBottom: '10%',
  },
  contentContainer: {
    padding: '5%',
    width: '90%',
  },
  ucCard: {
    padding: '16px',
    margin: '16px',
    maxWidth: '314px',
    marginTop: '42px',
    marginLeft: "32px"
  },
  ucCardTitle: {
    fontSize: '16px',
    fontWeight: '400',
  },
  ucTitle: {
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '20px',
    marginTop: '12px',
    fontFamily: "'Roboto', sans-serif",
  },
  ucDescription: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#757575',
    height: '20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  ucDateContainer: {
    backgroundColor: '#F6F5FA',
    borderRadius: '8px',
    padding: '14px 18px 14px 18px',
  },
  ucDay: {
    marginBottom: '4px',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
  },
  ucMonth: {
    marginTop: '4px',
    fontSize: '14px',
    fontWeight: '400',
    textAlign: 'center',
  },
  ucSubTitle: {
    fontSize: '14px',
    fontWeight: '600',
  },
  ucInfo: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#757575',
  },
})

export default function MyEvents(props) {
  const classes = useStyles()

  const [loading, setLoading] = React.useState(true)
  const [events, setEvents] = React.useState([])

  React.useEffect(()=>{

    axios.get('/v1/my_events')
    .then((response) => {
      setEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      setLoading(false)
    })


  }, [])

  const updateState = () => {
    axios.get('/v1/my_events')
    .then((response) => {
      setEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const renderPage = (user) => {

    if(loading){
      return(<LinearProgress color='primary' />)
    }

    var selectedEvents = []

    for(var c=0; c<events.length; c++){
      if(events[c].registered || events[c].book_marked){
        selectedEvents.push(events[c])
      }
    }

    if(selectedEvents.length == 0){
      return(<div className={classes.container}>
        <Grid container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Typography className={`${classes.title} ${classes.centerText}`}>Oh oh, you aren’t registered for any events yet</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={`${classes.description} ${classes.centerText}`}>Find your first event on the <Link component={RouterLink} to='/app/events'>Discover</Link> page or if you know what you’re looking for <Link component={RouterLink} to='/app/search'>Search</Link> it</Typography>
          </Grid>
          <Grid item xs={12}>
            <img src='/img/empty_box.svg' className={classes.image} />
          </Grid>
        </Grid>

        </div>)
    }


    const rankSoonest = (a, b) => {
      const date1 = new Date(a.event.start_date).getTime()
      const date2 = new Date(b.event.start_date).getTime()

      if(date2 < new Date().getTime()){
        return -1
      }
      if(date1 < date2){
        return -1
      }
      if(date1 > date2){
        return 1
      }
      return 0
    }

    events.sort((a, b) => {
      // if both are the same rank by time
      return rankSoonest(a,b)
    })

    var upcomingEvent = null

    for(var c=0; c<events.length; c++){
      if((events[c].registered) && (new Date(events[c].event.start_date).getTime() > new Date().getTime())) {
        upcomingEvent = events[c]
        break
      }
    }

    return(<div className={classes.contentContainer}>
        <Grid container>
          <Grid item xs={8}>
            <Typography className={classes.title}>Hello {user.full_name}</Typography>
            <Typography className={classes.description}>Check out your upcoming and registered events.</Typography>
            <EventsTable updateState={updateState} events={events} />
          </Grid>
          <Grid item xs={4}>
            {upcomingEvent ? renderUCEvent(upcomingEvent) : <Typography>No Upcoming Events</Typography>}
          </Grid>
        </Grid>
      </div>)

  }

  const renderUCEvent = (my_event) => {

    const e = my_event.event

    var dayNumber = ''
    var month = ''

    const startDate = new Date(e.start_date)

    dayNumber = startDate.getDate()
    const months = {
      0: 'Jan',
      1: 'Feb',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'Aug',
      8: 'Sept',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    }

    month = months[startDate.getMonth()]

    return(<Paper elevation={4} square className={classes.ucCard}>
        <Typography className={classes.ucCardTitle}>Upcoming Event</Typography>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Link component={RouterLink} to={'/app/events/'+e._id} className={classes.ucTitle}>{e.name}</Link>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.ucDateContainer}>
              <Typography className={classes.ucDay}>{dayNumber}</Typography>
              <Typography className={classes.ucMonth}>{month}</Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.ucDescription}>{e.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.ucSubTitle}>Details</Typography>
            <Typography className={classes.ucInfo}>Type: {e.event_type.name}</Typography>
            <Typography  className={classes.ucInfo}>Date: {e.startDateLabel}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography  className={classes.ucSubTitle}>Location</Typography>
            <Typography  className={classes.ucInfo}>{e.location.address.formattedAddress}</Typography>
          </Grid>
        </Grid>
      </Paper>)

  }

  const notLoggedIn = () => {
    return(<div className={classes.container}>
      <Grid container
        direction='column'
        justify='center'
        alignItems='center'
      >
        <Grid item xs={12}>
          <Typography className={`${classes.title}`}>You have to be logged in to view ‘My Events’</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.description}>If you already have an account <Link component={RouterLink} to='/app/login'>Login</Link> or if you don’t <Link component={RouterLink} to='/app/signup' color='primary'>Signup</Link></Typography>
        </Grid>
        <Grid item xs={12}>
          <img src='/img/secure_login.svg' className={classes.image} />
        </Grid>
      </Grid>

      </div>)
  }

  return(<UserContext.Consumer>
      {(value) => {
        if(!value.username){
          return notLoggedIn()
        }
        return renderPage(value)
      } }
    </UserContext.Consumer>)

}
