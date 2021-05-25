import React from 'react'

import { Typography, Grid, LinearProgress, Divider, Button, IconButton, Link, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EventCard from '../../components/EventCard/EventCard.jsx'

import ShareIcon from '@material-ui/icons/Share'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'

import UserContext from '../../contexts/UserContext.js'

import { Link as RouterLink, Redirect, useHistory } from 'react-router-dom'

const util = require('../../../helpers/utilities.js')

const axios = require('axios').default

import Cookies from 'universal-cookie'
const cookies = new Cookies()

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
  contentFullHeight: {
    height: '100%',
  },
  purpleSide: {
    height: '100%',
    width: '100%',
    backgroundImage: 'linear-gradient(#4527A0, #673AB7) !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    maxHeight: '190px',
    maxWidth: '390px',
    objectFit: 'contain',
  },
  logoCaption: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    width: '60%',
    textAlign: 'center',
    marginTop: '16px',
  },
  title: {
    fontWeight: '400',
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: '42px',
  },
  description: {
    fontWeight: '400',
    color: '#757575',
    fontFamily: 'Roboto',
  },
  textCentered: {
    width: '100%',
    textAlign: 'center',
  },
  leftSide: {
    padding: '10%',
  }
})

export default function Event(props){
  const classes = useStyles()

  const [eventData, setEventData] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  const [user, setUser] = React.useState({})
  const [userLoggedin, setUserLoggedin] = React.useState(false)
  const [redirect, setRedirect] = React.useState(false)

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [nameError, setNameError] = React.useState(false)
  const [emailError, setEmailError] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(false)
  const [confirmError, setConfirmError] = React.useState(false)

  const history = useHistory()

  React.useEffect(()=>{

    var element = document.getElementById("mainGrid")
    const height = window.innerHeight - 60

    element.style.height = `${height}px`

  },[])

  const register = () => {

    if(name.length == 0){
      setNameError(true)
      setEmailError(false)
      setPasswordError(false)
      setConfirmError(false)
      setErrorMessage('You must enter your name.')
      return
    }
    if(!util.isEmail(email)){
      setNameError(false)
      setEmailError(true)
      setPasswordError(false)
      setConfirmError(false)
      setErrorMessage('You must enter a valid email.')
      return
    }
    if(password.length == 0){
      setNameError(false)
      setEmailError(false)
      setPasswordError(true)
      setConfirmError(false)
      setErrorMessage('You must enter a password.')
      return
    }
    if(password != confirm){
      setNameError(false)
      setEmailError(false)
      setPasswordError(false)
      setConfirmError(true)
      setErrorMessage('Passwords must match.')
      return
    }

    setNameError(false)
    setEmailError(false)
    setPasswordError(false)
    setConfirmError(false)

    setLoading(true)

    const account = {
      username: email.toLowerCase(),
      password: password
    }

    axios.post('/v1/register_login', account)
    .then((response) => {
      console.log(response)
      const updates = {
        full_name: name,
        email: email
      }
      axios.patch('/v1/user/'+response.data._id, updates)
      .then((update_response) => {
        console.log(update_response)

        var url

        const redirect = new URLSearchParams(props.location.search).get('redirect')
        if(redirect){
          url = redirect
        }else{
          const link = '/app/my_events'
          url = window.location.hostname+link
        }

        location.replace(url)
      }).catch((error) => {
        console.log(error)
      })
      cookies.set('logged_in', true, { path: '/' })
    })
    .catch((error) => {
      console.log(error)
    })

  }

  if(userLoggedin){
    return(<Redirect to='/app/my_events' push />)
  }

  if(redirect){
    return(<Redirect to='/app/my_events' push />)
  }

  return(
    <React.Fragment>
      <UserContext.Consumer>
        {(value) => {setUser(value); setUserLoggedin(value.username ? true : false)} }
      </UserContext.Consumer>

      <Grid container id="mainGrid" className={classes.contentFullHeight}>
        <Grid item xs={12} md={5}>
          <Grid container spacing={3} className={classes.leftSide}>
            <Grid item xs={12}>
              <Typography className={classes.title}>Sign up.</Typography>
              <Typography className={classes.description}>Sign up to start registering for events and spaces in Mississauga.</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
                label='Full Name'
                type='text'
                fullWidth
                variant='outlined'
                className={classes.verticalMargin}
                autoComplete='off'
                required
                error={nameError}
                helperText={nameError ? errorMessage : null}
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'off',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                label='Email'
                type='email'
                fullWidth
                variant='outlined'
                className={classes.verticalMargin}
                autoComplete='off'
                required
                error={emailError}
                helperText={emailError ? errorMessage : null}
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'off',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                label='Password'
                type='password'
                fullWidth
                variant='outlined'
                className={classes.verticalMargin}
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'off',
                  },
                }}
                error={passwordError}
                helperText={passwordError ? errorMessage : null}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={confirm}
                onChange={(e)=>{setConfirm(e.target.value)}}
                label='Confirm Password'
                type='password'
                fullWidth
                variant='outlined'
                className={classes.verticalMargin}
                inputProps={{
                    autocomplete: 'new-password',
                    form: {
                      autocomplete: 'off',
                    },
                  }}
                  error={confirmError}
                  helperText={confirmError ? errorMessage : null}
                  required
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth onClick={register} variant='contained' color='primary'>Sign Up</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography className={`${classes.description}  ${classes.textCentered}`}>Already have an account? <Link component={RouterLink} to='/app/login'>Log in</Link></Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7} >
          <div className={classes.purpleSide}>
            <img src='/img/logo_white_vertical.png' className={classes.logo} />
            <Typography className={classes.logoCaption}>Join Mississauga Active to register for City events and book spaces at our facilities</Typography>
          </div>
        </Grid>
      </Grid>

    </React.Fragment>
  )

}
