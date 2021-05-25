import React, { forwardRef } from 'react'

import { Button, TextField, Grid, Typography, Paper } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

import { Delete, Edit } from '@material-ui/icons'

const axios = require('axios').default

import { tableIcons } from '../../components/TableIcons/TableIcons.jsx'


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
  }
}))

export default function EventTypes(props){
  const classes = useStyles()

  const [dialog, setDialog] = React.useState(false)
  const [name, setName] = React.useState('')
  const [eventTypeData, setEventTypeData] = React.useState([])
  

  const [eventTypesSelected, setEventTypesSelected] = React.useState([])

  React.useEffect(()=>{

    axios.get('/v1/event_types')
    .then((response) => {
      setEventTypeData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  },[])

  const createEventType = (e) => {

    e.preventDefault()

    const body = {
      name: name
    }
    // Post event_type to database
    axios.post('/v1/event_types', body)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      setName('')
      setDialog(false)
      updateState()
    })

  }

  const openAddET = () => {
    setDialog(true)
    setName('')
  }

  const handleClose = () => {
    setDialog(false)
  }

  const updateState = () => {

    axios.get('/v1/event_types')
    .then((response) => {
      setEventTypeData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  }

  const handleRowClick = (event, rowData) => {

    let results = Array.from(eventTypeData)
    const index = results.indexOf(rowData)
    results[index].tableData.checked = !results[index].tableData.checked
    setEventTypeData(results)

    //add or remove the item from the selected array
    let selected_rows = Array.from(eventTypesSelected)
    if(results[index].tableData.checked){
      selected_rows.push(results[index])
      setEventTypesSelected(selected_rows)
    }else{
      const selected_index = selected_rows.indexOf(rowData)
      selected_rows.splice(selected_index, 1)
      setEventTypesSelected(selected_rows)
    }

  }

  const removeSelectedItems = (data) => {

    // seperate contacts and teams
    // clean out contacts and teams and only allow top level to be removed
    for(var c=0; c<data.length; c++){
      const item = data[c]
      axios.delete('/v1/event_types/'+item._id)
      .then((response) => {
        console.log(response.data)
        updateState()
      })
      .catch((error) => {
        console.log(error)
      })
    }

  }


  // No need for EDIT in event_type as only 1 field to change, same as creating a new one
  const tableActions = []
  tableActions.push({
    tooltip: 'Remove Selected',
    icon: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    onClick: (evt, data) => removeSelectedItems(data)
  })



  return(
    <React.Fragment>
      <Dialog open={dialog} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <form onSubmit={createEventType}>

          <DialogTitle id='form-dialog-title'>Add Event Type</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Event types are used to categorize new events. Add an event type to appear when you create a new event.
            </DialogContentText>
            <TextField
              autoFocus
              value={name}
              onChange={(e)=>{setName(e.target.value)}}
              label='New Event Type Name'
              type='text'
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Cancel
            </Button>
            <Button color='primary' type='submit'>
              Create
            </Button>
          </DialogActions>
        </form>
        </Dialog>

      <Grid container
        direction="row"
        justify="space-between"
        alignItems="center"
        >
        <Grid item>
          <Typography className={classes.title} >Event Types</Typography>
        </Grid>
        <Grid item>
          <Button className={classes.addButton} variant='contained' color='primary' onClick={openAddET} >Add Event Type</Button>
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
          ]}
          data={eventTypeData}
          options={{
            selection: true,
            selectionProps: rowData => ({
              color: 'primary'
            })
          }}
          onRowClick={handleRowClick}
          onSelectionChange={(rows) => setEventTypesSelected(rows)}
          actions={tableActions}
          />
      </div>

    </React.Fragment>
  )

}
