import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
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
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import { Link, useLocation, useHistory, Redirect, Switch, Route } from 'react-router-dom'

import { Link as MUILink } from '@material-ui/core'

// page icons
import EventIcon from '@material-ui/icons/Event'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'

import EventTypesPage from '../EventTypes.jsx'
import EventsPage from '../Events.jsx'
import LocationsPage from '../Locations.jsx'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

  root: {
    display: 'flex',
    backgroundColor: '#ffffff',
    minHeight: '100%',
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
    backgroundColor: '#F8F9FB'
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: '#F8F9FB',
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
    width: '64px',
    backgroundColor: '#F8F9FB',
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
    backgroundColor: '#F8F9FB'

    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
    textDecoration: 'none',
    color: 'gray',

  },
  page_title: {
    flexGrow: 1,
  },
  list: {
    backgroundColor: '#F8F9FB',
  },

  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  logo: {
    width: '70%',
    marginLeft: '15%',
    marginRight: '15%',
    marginTop: '32px',
    marginBottom: '100px'
  },
  unselectedBorder: {
    borderLeft: '2px solid #F8F9FB',
  },
  selectedBorder: {
    borderLeft: '2px solid #673AB7',
    focusVisible: {
      color: 'gray !important'
    }
  },
  selectedLink: {
    color: '#673AB7',
    focusVisible: {
      color: 'gray !important'
    }
  },
  unselectedLink: {
    color: '#757575'
  },
  residentLink: {
    position: 'absolute',
    bottom: '50px',
    marginLeft: '34px',
  }
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [openNewMessage, setOpenNewMessage] = React.useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>

    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        {/*open ?
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          :
          <IconButton onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
         */}
         <img className={classes.logo} src='/img/purple_logo_vertical.png' />
      </div>

      <List className={classes.list}>
        {[{name: 'Events', link: '/admin/events', icon: <EventIcon className={useLocation().pathname == '/admin/events'? classes.selectedLink : classes.unselectedLink} /> }, {name: 'Locations', link: '/admin/locations', icon: <LocationCityIcon className={useLocation().pathname == '/admin/locations'? classes.selectedLink : classes.unselectedLink} />}, {name: 'Event Types', link: '/admin/event_types', icon: <DirectionsRunIcon className={useLocation().pathname == '/admin/event_types'? classes.selectedLink : classes.unselectedLink} />}].map((text, index) => (
          <Link push key={text.name} color='primary' to={text.link} className={`${'nav-link'} `}>
            <ListItem button  color='primary' className={useLocation().pathname == text.link ? classes.selectedBorder : classes.unselectedBorder}>
              <ListItemIcon>{text.icon}</ListItemIcon>
              <ListItemText primary={text.name} className={text.link == useLocation().pathname ? classes.selectedLink : classes.unselectedLink} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Button className={classes.residentLink} color='primary' component={Link} to='/app/events'><ArrowBackIosIcon color='primary'/>Resident Portal</Button>
    </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Switch>
          <Route exact path='/admin' component={EventsPage} />
          <Route exact path='/admin/events' component={EventsPage} />
          <Route exact path='/admin/event_types' component={EventTypesPage} />
          <Route exact path='/admin/locations' component={LocationsPage} />
        </Switch>

      </main>
    </div>
  );
}
