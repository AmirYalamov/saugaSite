import React from 'react'

import { Typography, Grid, LinearProgress, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EventCard from '../../components/EventCard/EventCard.jsx'

import ShareIcon from '@material-ui/icons/Share'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import BookmarkIcon from '@material-ui/icons/Bookmark'

import UserContext from '../../contexts/UserContext.js'

import { useHistory } from 'react-router-dom'

const axios = require('axios').default

const useStyles = makeStyles({
  blurredImage: {
    width: '100%',
    height: '400px',
    objectFit: 'fit',
    filter: 'blur(32px)',
    webkitFilter: 'blur(32px)',
    top: '60px',
    left: '0',
    right: '0',
    zIndex: '-100',
  },
  contentContainer: {
    width: '100%',
    width: '75%',
    marginRight: '12.5%',
    marginLeft: '12.5%',
    position: 'absolute',
    top: '0px',
    marginBottom: '96px',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.15)',
    borderRadius: '2px',
    paddingBottom: '32px',
  },
  mainContent: {
    marginTop: '64px',
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
  },
  headerImage: {
    width: '66%',
  },
  eventSummary: {
    width: '34%',
    backgroundColor: '#F5F5F5',
    paddingLeft: '28px',
  },
  date: {
    fontWeight: '300',
    fontSize: '14px',
    color: '#2C2C2C',
    marginTop: '32px',
    marginBottom: '24px'
  },
  name: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#1F1F1F',
    marginBottom: '4px',
  },
  location: {
    color: '#707070',
    fontWeight: '400 !important',
  },
  description: {
    textAlign: 'justify',
    fontWeight: '300',
    color: '#494949',
  },
  actionBar: {
    height: '92px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsLeft: {
    width: '66%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRight: {
    width: '34%',
  },
  actions: {

  },
  spots: {

  },
  spotsRemainingLabel: {
    fontFamily: 'Roboto',
    fontSize: '16px',
    color: '#1F1F1F'
  },
  iconButton: {
    marginLeft: '16px',
  },
  registerButton: {
    marginLeft: '16px',
    marginRight: '16px',
    width: 'calc(100% - 32px)',
  },
  detailSection: {
    width: '100%',
    display: 'flex',
    paddingTop: '32px',
  },
  detailLeft: {
    width: '56%',
    paddingLeft: '10%',

  },
  detailRight: {
    width: '34%',
    display: 'flex',
    flexDirection: 'column'

  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '16px',
    paddingRight: '16px',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: '8px',
  },
  sectionText: {
    color: '#757575',
    fontWeight: '300',
  },
  registrationClosed: {
    textAlign: 'center',
    fontWeight: '600',
  }
})

export default function Event(props){
  const classes = useStyles()
  let history = useHistory()

  const [eventData, setEventData] = React.useState({})
  const [loading, setLoading] = React.useState(true)

  const [user, setUser] = React.useState({})
  const [userLoggedin, setUserLoggedin] = React.useState(false)

  const [myEvent, setMyEvent] = React.useState({book_marked: false, event: props.match.params.event_id, registered: false})

  React.useEffect(()=>{

    axios.get('/v1/events/'+props.match.params.event_id)
    .then((response) => {
      setEventData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      setLoading(false)
    })

    axios.get('/v1/my_events/'+props.match.params.event_id)
    .then((response) => {
      if(response.data.event){
        setMyEvent(response.data)
        console.log(response.data)
      }
    })
    .catch((error) => {
      console.log(error)
    })

  },[])

  const updateState = () => {
    axios.get('/v1/events/'+props.match.params.event_id)
    .then((response) => {
      setEventData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  const bookmark = () => {

    const body = {
      event: eventData._id,
      book_marked: !myEvent.book_marked,
      registered: myEvent.registered
    }

    axios.put('/v1/my_events', body)
    .then((response) => {
      console.log(response.data)
      if(response.data){
        setMyEvent(response.data)
      }
    })
    .catch((error) => {
      console.log(error)
    })

  }

  const register = () => {

    if(!user.full_name){
      //have the user login to register
      const link = window.location.href
      history.push('/app/signup?redirect='+link)
      return
    }

    const body = {
      event: eventData._id,
      book_marked: myEvent.book_marked,
      registered: !myEvent.registered
    }

    axios.put('/v1/my_events', body)
    .then((response) => {
      console.log(response.data)
      if(response.data){
        setMyEvent(response.data)
      }
      updateState()
    })
    .catch((error) => {
      console.log(error)
    })

  }

  const renderRegisterButton = () => {

    if(myEvent && myEvent.registered){
      return(<Button color='primary' variant='outlined' onClick={register} className={classes.registerButton}>Unregister</Button>)
    }

    if(eventData.spots_available == 0){
      return(<Tooltip title='This event is full. You can no longer register for it.'><span><Button color='primary' variant='contained' onClick={register} className={classes.registerButton} disabled={true} >Register</Button></span></Tooltip>)
    }

    if(new Date(eventData.start_date).getTime() < new Date().getTime()){
      return(<Typography className={classes.registrationClosed}>Registration Closed</Typography>)
    }

    return (<Button color='primary' variant='contained' onClick={register} className={classes.registerButton} >Register</Button>)

  }

  let spotsRemainingLabel

  if(new Date(eventData.start_date).getTime() < new Date().getTime()){
    spotsRemainingLabel = ''
  }
  else if(eventData.spots_available == 1){
    spotsRemainingLabel = '1 spot left'
  }else if(eventData.spots_available == 0){
    spotsRemainingLabel = 'Event Is Full'
  }else{
    spotsRemainingLabel = eventData.spots_available+' spots left'
  }

  return(
    <React.Fragment>
      <UserContext.Consumer>
        {(value) => {setUser(value); setUserLoggedin(value.username ? true : false)} }
      </UserContext.Consumer>

      {loading ? <LinearProgress color='primary' /> :

        (<React.Fragment>
          <img src={eventData.image_url} className={classes.blurredImage} />

          <div className={`${classes.contentContainer}`}>
            <div className={classes.mainContent}>
              <div className={classes.header}>
                <img src={eventData.image_url} className={classes.headerImage} />
                <div className={classes.eventSummary}>
                  <Typography className={classes.date}>{eventData.startDateLabel}</Typography>
                  <Typography className={classes.name}>{eventData.name}</Typography>
                  <Typography className={classes.location}>{eventData.location.name}</Typography>
                </div>
              </div>

              <div className={classes.actionBar}>
                <div className={classes.actionsLeft}>
                  <div className={classes.actions}>
                    <IconButton color='primary' aria-label='Share' className={classes.iconButton}>
                      <ShareIcon />
                    </IconButton>
                    {myEvent && myEvent.book_marked ?
                      <IconButton color='primary' aria-label='Bookmark' onClick={bookmark} className={classes.iconButton}>
                        <BookmarkIcon />
                      </IconButton>
                       :
                      <IconButton color='primary' aria-label='Bookmark' onClick={bookmark} className={classes.iconButton}>
                        <BookmarkBorderIcon />
                      </IconButton>
                    }

                  </div>
                  <div className={classes.spots}>
                    <span className={classes.spotsRemainingLabel}>{spotsRemainingLabel}</span>
                  </div>
                </div>
                <div className={classes.actionsRight}>

                {renderRegisterButton()}

                </div>
              </div>
              <Divider />
              <div className={classes.detailSection}>
                <div className={classes.detailLeft}>
                  <Typography className={classes.sectionTitle}>Details</Typography>
                  <Typography className={classes.description}>{eventData.description}</Typography>
                </div>
                <div className={classes.detailRight}>
                  <div className={classes.rightSection}>
                    <Typography className={classes.sectionTitle}>Date and Time</Typography>
                    <Typography className={classes.sectionText}>{eventData.startDateLabel}</Typography>
                  </div>
                  <div className={classes.rightSection}>
                    <Typography className={classes.sectionTitle}>Location</Typography>
                    <Typography className={`${classes.sectionText} ${classes.location}`}>{eventData.location.name}</Typography>
                    <Typography className={classes.sectionText}>{eventData.location.address.formattedAddress}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </React.Fragment>)

      }
    </React.Fragment>
  )

}
