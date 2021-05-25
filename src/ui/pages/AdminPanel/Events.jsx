import React, { forwardRef } from 'react'

import { Button, TextField, Grid, Typography, Paper } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

import { Delete, Edit } from '@material-ui/icons'

const axios = require('axios').default

import { tableIcons } from '../../components/TableIcons/TableIcons.jsx'

import CreateEvent from '../../components/CreateEvent/CreateEvent.jsx'
import EditEvent from '../../components/EditEvent/EditEvent.jsx'

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '300',
    fontSize: '40px',
    color: '#000000',
    margin: '32px',
  },
  addButton: {
    marginRight: '32px',
  },
  optionsLoading: {
    width: '18px',
    height: '18px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  tableContainer: {
    marginLeft: '32px',
    marginRight: '32px',
  },
  verticalMargin: {
    marginTop: '16px',
    marginBottom: '16px',
  }
}))

export default function Events(props){
  const classes = useStyles()

  const [events, setEvents] = React.useState([])

  const [eventsSelected, setEventsSelected] = React.useState([])

  const [open, setOpen] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)

  const [editId, setEditId] = React.useState('')

  React.useEffect(()=>{

    axios.get('/v1/events')
    .then((response) => {
      setEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  },[])

  const createLocation = () => {

    const body = {
      name: name,
      description: description,
      address: address,
    }

    axios.post('/v1/events', body)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      setDialog(false)
      updateState()
    })

  }

  const openAddET = () => {
    setDialog(true)
  }

  const handleClose = () => {
    setDialog(false)
  }

  const updateState = () => {

    axios.get('/v1/events')
    .then((response) => {
      setEvents(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  }

  const handleRowClick = (event, rowData) => {

    let results = Array.from(events)
    const index = results.indexOf(rowData)
    results[index].tableData.checked = !results[index].tableData.checked
    setEvents(results)

    //add or remove the item from the selected array
    let selected_rows = Array.from(eventsSelected)
    if(results[index].tableData.checked){
      selected_rows.push(results[index])
      setEventsSelected(selected_rows)
    }else{
      const selected_index = selected_rows.indexOf(rowData)
      selected_rows.splice(selected_index, 1)
      setEventsSelected(selected_rows)
    }

  }

  const removeSelectedItems = (data) => {

    // seperate contacts and teams
    // clean out contacts and teams and only allow top level to be removed
    for(var c=0; c<data.length; c++){
      const item = data[c]
      axios.delete('/v1/events/'+item._id)
      .then((response) => {
        console.log(response.data)
        updateState()
      })
      .catch((error) => {
        console.log(error)
      })
    }

  }

  const editSelectedRow = (data) => {

    const item = data[0]

    setEditId(item._id)
    setOpenEdit(true)

  }

  const searchResult = (address) => {
    setAddress(address)
  }

  const setTheInputValue = (inputValue) => {
    setInputValue(inputValue)
  }

  const tableActions = []

  if(eventsSelected.length == 1){
    tableActions.push({
      tooltip: 'Edit Selected',
      icon: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
      onClick: (evt, data) => editSelectedRow(data)
    })
  }

  tableActions.push({
        tooltip: 'Remove Selected',
        icon: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
        onClick: (evt, data) => removeSelectedItems(data)
      })



  return(
    <React.Fragment>

      <CreateEvent open={open} setOpen={setOpen} updateState={updateState} />
      <EditEvent eventId={editId} open={openEdit} setOpen={setOpenEdit} updateState={updateState} />

      <Grid container
        direction="row"
        justify="space-between"
        alignItems="center"
        >
        <Grid item>
          <Typography className={classes.title} >Events</Typography>
        </Grid>
        <Grid item>
          <Button className={classes.addButton} variant='contained' color='primary' onClick={()=>{setOpen(true)}} >Create Event</Button>
        </Grid>
      </Grid>

      <div className={classes.tableContainer}>
        <MaterialTable
          components={{
            Container: props => (
              <Paper elevation={0} className='table' {...props} />
            )
          }}
          title=''
          icons={tableIcons}
          columns={[
            { title: 'Name', field: 'name' },
            { title: 'Type', field: 'event_type.name' },
            { title: 'Location', field: 'location.name' },
            { title: 'Starts At', field: 'startDateLabel' },
          ]}
          data={events}
          options={{
            selection: true,
            selectionProps: rowData => ({
              color: 'primary'
            })
          }}
          onRowClick={handleRowClick}
          onSelectionChange={(rows) => setEventsSelected(rows)}
          actions={tableActions}
          />
      </div>

    </React.Fragment>
  )

}
