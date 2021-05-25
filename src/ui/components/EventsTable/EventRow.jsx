import React from 'react'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

const axios = require('axios').default

const useStyles = makeStyles({
  row: {
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
       backgroundColor: "#F4F4F4",
    },
  },
  cell: {
    paddingLeft: '8px',
    paddingRight: '16px',
    paddingTop: '32px',
    paddingBottom: '32px',

  },

})

export default function EventRow(props){
  const classes = useStyles()
  const history = useHistory()
  const eventData = props.eventData
  var myEvent = props.myEvent

  const [anchorEl, setAnchorEl] = React.useState(null)

  React.useEffect(()=>{
    myEvent = props.myEvent
  }, [props.myEvent])

  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const openEvent = (event) => {
    event.stopPropagation()
    history.push('/app/events/'+eventData._id)
  }

  const openMenu = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const toggleRegister = (event) => {
    event.stopPropagation()

    const id = myEvent._id

    const updates = {
      registered: !myEvent.registered
    }

    axios.patch('/v1/my_events/'+id, updates)
    .then((response) => {
      console.log(response)
      props.updateState()
    })
    .catch((error) => {
      console.log(error)
    })

  }
  const toggleBookmark = (event) => {
    event.stopPropagation()

    const id = myEvent._id

    const updates = {
      book_marked: !myEvent.book_marked
    }

    axios.patch('/v1/my_events/'+id, updates)
    .then((response) => {
      console.log(response)
      props.updateState()
    })
    .catch((error) => {
      console.log(error)
    })

  }

  return(<tr className={classes.row} onClick={openEvent}>
      <td className={classes.cell}>{eventData.name}</td>
      <td className={classes.cell}>{eventData.event_type.name}</td>
      <td className={classes.cell}>{eventData.location.name}</td>
      <td className={classes.cell}>{eventData.startDateLabel}</td>
      <td className={classes.cell}>
        <IconButton color='primary' onClick={openMenu}><MoreVertIcon/></IconButton>
        <Menu
           id='simple-menu'
           anchorEl={anchorEl}
           keepMounted
           open={Boolean(anchorEl)}
           onClose={handleClose}
         >
           <MenuItem onClick={toggleRegister}>{!myEvent.registered ? 'Register' : 'Unregister'}</MenuItem>
           <MenuItem onClick={toggleBookmark}>{!myEvent.book_marked ? 'Bookmark' : 'Unbookmark'}</MenuItem>
           <MenuItem>View</MenuItem>
         </Menu>
      </td>
    </tr>)

}
