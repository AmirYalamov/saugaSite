import React from 'react'

import { Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Counter from '../../components/Counter/Counter.jsx'

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    // border: '2px solid white',
    border: '1px solid rgba(0,0,0,.09)',
    borderRadius: '4px',
    width: '100%',
    height: '100%',
    padding: '6px',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
    // boxShadow: '0 1px 3px 0 rgba(0,0,0,0.3)',
    boxShadow: '0 2px 0 0 rgba(0,0,0,.03)'

  },

  title: {
    margin: '0px',
    marginTop: '16px',
    color: 'black',
    fontSize: '18px',
    width: '100%',
    textAlign: 'center'
  }

}))

export default function ExamplePage (props) {
  const classes = useStyles()

  return (
    <>
      <Paper className={classes.mainContainer}>
        <Typography component='h3' variant='h3' className={`${classes.title}`}>Example Page</Typography>
        <Typography>This is an content.</Typography>
      </Paper>
      <Counter />
    </>
  )
}
