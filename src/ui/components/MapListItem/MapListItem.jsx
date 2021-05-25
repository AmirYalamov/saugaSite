import React from 'react'

import { Divider } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { useHistory } from 'react-router-dom'

const useStyles = makeStyles({

  container: {
    fontFamily: "'Roboto', sans-serif",
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: '#EEEEEE'
    }
  },
  nameLabel: {

  },
  dateLabel: {
    color: 'gray',
  }

})

export default function MapListItem(props){
  const classes = useStyles()

  const history = useHistory()

  const eventData = props.eventData

  const openEvent = () => {
    history.push('/app/events/'+eventData._id)
  }

  return(<React.Fragment><div onClick={openEvent} className={classes.container}>
    <p className={classes.nameLabel}>{eventData.name}</p>
    <p className={classes.dateLabel}>{eventData.startDateLabel}</p>
    </div>
    <Divider />
    </React.Fragment>)

}
