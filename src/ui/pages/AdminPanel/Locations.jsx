import React, { forwardRef } from 'react'

import { Button, TextField, Grid, Typography, Paper } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

import { Delete, Edit } from '@material-ui/icons'

const axios = require('axios').default

import { tableIcons } from '../../components/TableIcons/TableIcons.jsx'

import AddressSearch from '../../components/AddressSearch/AddressSearch.jsx'

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

export default function Locations(props){
  const classes = useStyles()

  const [dialog, setDialog] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [locations, setLocations] = React.useState([])

  const [address, setAddress] = React.useState({})
  const [inputValue, setInputValue] = React.useState('')
  const [addressError, setAddressError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const [isEditing, setIsEditing] = React.useState(false)

  const [locationsSelected, setLocationsSelected] = React.useState([])

  React.useEffect(()=>{

    axios.get('/v1/locations')
    .then((response) => {
      setLocations(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  },[])

  const createLocation = (e) => {

    e.preventDefault()

    // If no address, inform user
    if (!address || !address.coordinate || !address.coordinate.latitude) {
      setAddressError(true)
      setErrorMessage("Locations must have an associated address")
      return
    }

    const body = {
      name: name,
      description: description,
      address: address,
    }

    axios.post('/v1/locations', body)
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
    setIsEditing(false)
    setDialog(true)
    setName('')
  }

  const handleClose = () => {
    setDialog(false)
  }

  const updateState = () => {

    axios.get('/v1/locations')
    .then((response) => {
      setLocations(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

  }

  const handleRowClick = (event, rowData) => {

    let results = Array.from(locations)
    const index = results.indexOf(rowData)
    results[index].tableData.checked = !results[index].tableData.checked
    setLocations(results)

    //add or remove the item from the selected array
    let selected_rows = Array.from(locationsSelected)
    if(results[index].tableData.checked){
      selected_rows.push(results[index])
      setLocationsSelected(selected_rows)
    }else{
      const selected_index = selected_rows.indexOf(rowData)
      selected_rows.splice(selected_index, 1)
      setLocationsSelected(selected_rows)
    }

  }

  const removeSelectedItems = (data) => {

    // seperate contacts and teams
    // clean out contacts and teams and only allow top level to be removed
    for(var c=0; c<data.length; c++){
      const item = data[c]
      axios.delete('/v1/locations/'+item._id)
      .then((response) => {
        console.log(response.data)
        updateState()
      })
      .catch((error) => {
        console.log(error)
      })
    }

  }

  const searchResult = (address) => {
    setAddress(address)
  }

  const setTheInputValue = (inputValue) => {
    setInputValue(inputValue)
  }

  const editSelectedRow = async (data) => {
    setName((data[0].name))
    setDescription((data[0].description))
    setAddress((data[0].address.formattedAddress))
    console.log(data[0].address)
    setDialog(true)
  }

  const tableActions = []
  // if (locationsSelected.length == 1) {
  //   tableActions.push({
  //     tooltip: 'Edit Selected',
  //     icon: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  //     onClick: (evt, data) => {editSelectedRow(data); setIsEditing(true)}
  //   })
  // }

  tableActions.push({
    tooltip: 'Remove Selected',
    icon: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    onClick: (evt, data) => removeSelectedItems(data)
  })

  return(
    <React.Fragment>

      <Dialog open={dialog} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <form onSubmit={createLocation}>
          <DialogTitle id='form-dialog-title'>Add Location</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Locations are used to create events at. This helps your residents know where events are taking place.
            </DialogContentText>
            <TextField
              autoFocus
              value={name}
              onChange={(e)=>{setName(e.target.value)}}
              label='Location Name'
              type='text'
              fullWidth
              variant='outlined'
              required
              className={classes.verticalMargin}
            />
            <TextField
              autoFocus
              value={description}
              onChange={(e)=>{setDescription(e.target.value)}}
              label='Description'
              type='text'
              fullWidth
              variant='outlined'
              required
              className={classes.verticalMargin}
            />
            <AddressSearch className={classes.verticalMargin} textFieldLabel='Street Address' returnSearchResult={searchResult} returnInputValue={setTheInputValue} error={addressError} helperText={addressError ? errorMessage : 'You can search or enter your address mannually'}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Cancel
            </Button>
            <Button type='submit' color='primary'>
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
          <Typography className={classes.title} >Locations</Typography>
        </Grid>
        <Grid item>
          <Button className={classes.addButton} variant='contained' color='primary' onClick={openAddET} >Add Location</Button>
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
            { title: 'Address', field: 'address.formattedAddress' },
          ]}
          data={locations}
          options={{
            selection: true,
            selectionProps: rowData => ({
              color: 'primary'
            })
          }}
          onRowClick={handleRowClick}
          onSelectionChange={(rows) => setLocationsSelected(rows)}
          actions={tableActions}
          />
      </div>

    </React.Fragment>
  )

}
