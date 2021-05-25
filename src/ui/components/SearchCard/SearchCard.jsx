import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: '16px',
    padding: '16px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    }
  },
  image: {
    width: '100%',
    height: '100%',
  },
  img: {
    maxHeight: '100%',
    maxWidth: '100%',
    // objectFit: 'cover',
    marginLeft: '8px !important',
    marginRight: '8px !important',
    borderRadius: '4px',
  },
  content: {
    paddingLeft: '8px',
    alignItems: 'center'
  }
})

export default function SearchCard(props) {
  const classes = useStyles()
  let history = useHistory()

  const eventData = props.eventData

  console.log(eventData)

  const goToEvent = () => {
    // open event page here
    // const link = '/app/events/'+item._id
    history.push('/app/events/'+eventData._id)
  }

  return (
    <Grid className={classes.root} item xs={7}>
      <Paper className={classes.paper} elevation={0} onClick={goToEvent}>
        <Grid container>
          <Grid item xs={4}>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="Event Image" src={eventData.image_url} />
            </ButtonBase>
          </Grid>
          <Grid item xs={8} sm container className={classes.content}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="subtitle1" color="primary">
                  {eventData.startDateLabel}
                </Typography>
                <Typography variant="h6" >
                  {eventData.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {eventData.location.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}
