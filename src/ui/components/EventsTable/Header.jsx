import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  cell: {
    paddingLeft: '8px',
    paddingRight: '16px',
    textAlign: 'left',
    paddingTop: '18px',
    paddingBottom: '18px',
    fontSize: '16px',
    fontWeight: '500',
  },
  row: {
    backgroundColor: '#F6F5FA',
  }
})

export default function Header(props){

  const classes = useStyles()

  const columns = props.columns

  return(<thead><tr className={classes.row}>
      {columns.map((item, index) => {
        return(<th className={classes.cell}>{item}</th>)
      })}
    </tr></thead>)

}
