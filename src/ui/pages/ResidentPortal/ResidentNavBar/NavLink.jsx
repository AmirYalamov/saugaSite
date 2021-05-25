import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
  link: {
    width: '110px',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selected: {
    backgroundColor: '#7358C5',
  },
  title: {
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: '300',
  }
}))

export default function NavLink (props){
  const classes = useStyles()
  const title = props.title
  const link = props.link
  var selected = props.selected

  React.useEffect(()=>{
    selected = props.selected
  },[props.selected])

  return(
    <Link to={link} push >
      <div className={`${classes.link} ${selected ? classes.selected : null}`}>
        <span className={classes.title}>{title}</span>
      </div>
    </Link>
  )

}
