import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import TextsmsIcon from '@material-ui/icons/Textsms'
import ContactsIcon from '@material-ui/icons/Contacts'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import HomeIcon from '@material-ui/icons/Home'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MapIcon from '@material-ui/icons/Map'
import SettingsIcon from '@material-ui/icons/Settings'
import WebIcon from '@material-ui/icons/Web'
import { mdiAccountGroup, mdiAccountSupervisor } from '@mdi/js'
import Icon from '@mdi/react'
import AddBoxIcon from '@material-ui/icons/AddBox'
import MessageIcon from '@material-ui/icons/Message'
import DashboardIcon from '@material-ui/icons/Dashboard'

import { Link, useLocation, useHistory, Redirect, Switch, Route } from 'react-router-dom'

import NavLink from './NavLink.jsx'
import NavProfile from './NavProfile.jsx'

import DefaultRedirect from '../DefaultRedirect.jsx'
import DiscoverPage from '../Discover.jsx'
import EventPage from '../Event.jsx'
import LoginPage from '../Login.jsx'
import SignupPage from '../Signup.jsx'
import MyEvents from '../MyEvents.jsx'
import MapView from '../MapView.jsx'
import SearchPage from '../Search.jsx'

import UserContext from '../../../contexts/UserContext.js'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({

  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: '64px',
    padding: 0,
    backgroundColor: 'blue',

  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: '#fbfbfc'
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: '#fbfbfc',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '53px',
    backgroundColor: '#fbfbfc',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  sidebar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(1, 0),
    backgroundColor: '#fbfbfc'

    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    position: 'relative',
    // backgroundColor: '#F6F5FA',
    minHeight: '100%',
  },
  sidecontent: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: '57px',
    height: '100%',
  },
  link: {

    primary: {textDecoration: 'none'},
    color: 'gray',

  },
  page_title: {
    flexGrow: 1,
  },
  list: {
    backgroundColor: '#fbfbfc',
  },

  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  navBar: {
    backgroundColor: '#4527A0',
    height: '60px',
    width: 'calc(100% - 80px)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '40px',
    paddingRight: '40px',
    zIndex: '100'
  },
  leftNav: {

  },
  rightNav: {
    display: 'flex',
  },
  logo: {
    maxWidth: '200px',
    objectFit: 'contain',
    marginTop: '8px',
    marginBottom: '8px',
  }
}))

export default function PersistentDrawerLeft() {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const [user, setUser] = React.useState({})

  const [openNewMessage, setOpenNewMessage] = React.useState(false)


  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>

      <UserContext.Consumer>
        {(value) => {setUser(value);} }
      </UserContext.Consumer>

      <div className={classes.navBar}>
        <div className={classes.leftNav}>
          <img src='/img/logo_white_horizontal.png' className={classes.logo} />
        </div>
        <div className={classes.rightNav}>
          <NavLink title='Search' link='/app/search' selected={useLocation().pathname.includes('/app/search')}  />
          <NavLink title='My Events' link='/app/my_events' selected={useLocation().pathname.includes('/app/my_events')}  />
          <NavLink title='Map' link='/app/map' selected={useLocation().pathname.includes('/app/map')}  />
          <NavLink title='Discover' link='/app/events' selected={useLocation().pathname.includes('/app/events')}  />
          {user.full_name ?
            <NavProfile user={user} title={user.full_name ? user.full_name[0].toUpperCase() : null} link='/app/my_events'  />
            :
            <NavLink title='Login' link='/app/login' selected={useLocation().pathname.includes('/app/login')}  />
            }
        </div>
      </div>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Switch>
          <Route exact path='/app/login' component={LoginPage} />
          <Route exact path='/app/signup' component={SignupPage} />
          <Route exact path='/app/search' component={SearchPage} />
          <Route exact path='/app/my_events' component={MyEvents} />
          <Route exact path='/app/events' component={DiscoverPage} />
          <Route exact path='/app/events/:event_id' component={EventPage} />
          <Route exact path='/app/map' component={MapView} />
          <Route exact path='/app/map/:event_id' component={MapView} />
          <Route exact path='/' component={DefaultRedirect} />
        </Switch>

      </main>
    </div>
  )
}
