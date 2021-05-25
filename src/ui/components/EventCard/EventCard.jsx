import React from 'react'
import { Typography, Grid, Card, CardActionArea, CardActions, CardContent, CardMedia, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  description: {
    height: '20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  title: {
    height: '40px',
    overflow: 'hidden',
    fontSize: '16px',
    fontWeight: '500',
  },
  dateLabel: {
    color: '#5A5A5A',
    fontWeight: '300',
    fontSize: '12px',
  },
})


export default function EventCard(props) {
  const classes = useStyles()
  let history = useHistory()

  const item = props.item

  const goToEvent = () => {
    // console.log(item._id)
    // open event page here
    const link = '/app/events/'+item._id
    history.push(link)
  }

  return(
    <Grid item xs={3}>
      <Card className={classes.root}>
        <CardActionArea onClick={goToEvent}>
          <CardMedia
            className={classes.media}
            image={item.image_url}
            title="Activity Image"
          />
          <CardContent>
            <Typography className={classes.dateLabel} variant="h5" component="h2">
              {item.startDateLabel}
            </Typography>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">
              {item.name}
            </Typography>
            <Typography className={classes.description} variant="body2" color="textSecondary" component="p">
              {item.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        {/*<CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            See More
          </Button>
        </CardActions>*/}
      </Card>
    </Grid>
  )

}
