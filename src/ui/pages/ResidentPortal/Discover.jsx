import React from 'react'

import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EventCard from '../../components/EventCard/EventCard.jsx'

const axios = require('axios').default

const useStyles = makeStyles({
  eventGrid: {
    marginBottom: '24px',
    marginLeft: '32px',
    marginRight: '32px',

    width: 'calc(100% - 64px) !important',
  },
  sectionTitle: {
    marginLeft: '44px',
    marginTop: '16px',
    marginBottom: '16px',
    fontSize: '24px',
  }
})

export default function Discover(props){
  const classes = useStyles()

  const [events, setEvents] = React.useState([])

  React.useEffect(()=>{

    axios.get('/v1/discover_events')
    .then((response) => {
      setEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  },[])

  return(
    <React.Fragment>
      {events.map((event_type, index) => {
        if(event_type.events.length == 0){
          return
        }
        return(
          <React.Fragment>
            <Typography className={classes.sectionTitle}>{event_type.event_type.name}</Typography>
            <Grid className={classes.eventGrid} container spacing={3}>
              {event_type.events.map((item, event_index) => {
                return <EventCard item={item} />
              })}
            </Grid>
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )

}
