import React from 'react'

import Header from './Header.jsx'
import EventRow from './EventRow.jsx'

import { Tabs, Tab } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  table: {
    marginTop: '16px',
    fontFamily: "'Roboto', sans-serif",
    borderSpacing: '0px',
    width: '100%',
  }
})

export default function EventsTable(props){
  const classes = useStyles()
  var events = props.events

  const [selectedTab, setSelectedTab] = React.useState(0)

  const columns = ['Event', 'Type', 'Location', 'Date/Time', '']

  React.useEffect(() => {

    events = props.events

  },[props.events])

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab)
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const rankSoonest = (a, b) => {
    const date1 = new Date(a.event.start_date).getTime()
    const date2 = new Date(b.event.start_date).getTime()

    if(date2 < new Date().getTime()){
      console.log('already happened')
      return -1
    }
    if(date1 < date2){
      return -1
    }
    if(date1 > date2){
      return 1
    }
    return 0
  }

  var displayEvents = []

  if(selectedTab == 0){
    //all events
    for(var c=0; c<events.length; c++){
      if((events[c].registered || events[c].book_marked) && (new Date(events[c].event.start_date).getTime() > new Date().getTime())) {
        displayEvents.push(events[c])
      }
    }
  }else if(selectedTab == 1){
    //Bookmarked events
    for(var c=0; c<events.length; c++){
      if(events[c].book_marked){
        displayEvents.push(events[c])
      }
    }
  }else if(selectedTab == 2){
    //upcoming events
    for(var c=0; c<events.length; c++){
      if((events[c].registered || events[c].book_marked) && (new Date(events[c].event.start_date).getTime() > new Date().getTime())){
        displayEvents.push(events[c])
      }
    }
  }else if(selectedTab == 3){
    //past events
    for(var c=0; c<events.length; c++){
      if((events[c].registered || events[c].book_marked) && (new Date(events[c].event.start_date).getTime() < new Date().getTime())){
        displayEvents.push(events[c])
      }
    }
  }

  displayEvents.sort((a, b) => {
    // if both are the same rank by time
    return rankSoonest(a,b)
  })

  return(<div>
    <Tabs value={selectedTab} onChange={handleTabChange} aria-label='simple tabs example'>
         <Tab label='All' {...a11yProps(0)} />
         <Tab label='Bookmarked' {...a11yProps(1)} />
         <Tab label='Upcoming' {...a11yProps(2)} />
         <Tab label='Past' {...a11yProps(3)} />
       </Tabs>
    <table className={classes.table}>
      <Header columns={columns} />
      <tbody>
        {displayEvents.map((e, index) => {
          return(<EventRow updateState={props.updateState} key={index} myEvent={e} eventData={e.event} />)
        })}
      </tbody>
    </table>
  </div>)

}
