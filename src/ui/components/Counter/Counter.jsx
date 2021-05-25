import React from 'react'

import { Typography, Paper, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    borderRadius: '4px',
    padding: '6px',
    margin: '8px 0px 8px 0px'
  },

  counter: {
    margin: '0px',
    marginTop: '16px',
    color: 'black',
    fontSize: '18px',
    width: '100%',
    textAlign: 'center'
  },

  buttonSpacing: {
    marginRight: '8px'
  }

}))

export default function Counter (props) {
  const classes = useStyles()

  const [counter, setCounter] = React.useState(0)

  const countUp = (event) => {
    setCounter(counter + 1)
  }

  const countDown = (event) => {
    setCounter(counter - 1)
  }

  return (
    <Paper variant='outlined' className={classes.mainContainer}>
      <Typography component='h3' variant='h3'>Click to Count</Typography>
      <Typography className={classes.counter}>{counter}</Typography>
      <Button className={classes.buttonSpacing} variant='outlined' color='primary' onClick={countDown}>Count Down</Button>
      <Button variant='contained' color='primary' onClick={countUp}>Count Up</Button>
    </Paper>
  )
}
