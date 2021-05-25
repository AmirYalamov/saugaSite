import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import { Menu, MenuItem } from '@material-ui/core'

const axios = require('axios').default
import Cookies from 'universal-cookie'
const cookies = new Cookies()

const useStyles = makeStyles((theme) => ({
  link: {
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C98F0',
    borderRadius: '100px',
    marginLeft: '12px',
    marginTop: '10px',
    marginTop: '10px',
    cursor: 'pointer',
  },
  title: {
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: '300',
    fontWiehgt: '14px',
    userSelect: 'none',
  }
}))

export default function NavProfile (props){
  const classes = useStyles()
  let history = useHistory()
  const title = props.title
  const link = props.link

  const [anchorEl, setAnchorEl] = React.useState(null)

 const handleClick = (event) => {
   setAnchorEl(event.currentTarget)
 }

 const handleClose = () => {
   setAnchorEl(null)
 }

 const openAdmin = () => {
   history.push('/admin/events')
 }

 const handleLogout = () => {
   axios.get('/v1/logout')
  .then((response) => {
    cookies.set('logged_in', false, { path: '/' })
    location.replace('/app/login')
  })
  .catch((error) => {
    console.log(error)
  })
 }

  return(
    <span>
      <div className={`${classes.link}`} onClick={handleClick}>
        <span className={classes.title}>{title}</span>
      </div>

      <Menu
         id='simple-menu'
         anchorEl={anchorEl}
         keepMounted
         open={Boolean(anchorEl)}
         onClose={handleClose}
       >
         {props.user.admin ? <MenuItem onClick={openAdmin}>Admin Panel</MenuItem> : null }
         <MenuItem onClick={handleLogout}>Logout</MenuItem>
       </Menu>

    </span>
  )

}
