import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import { CircularProgress } from '@material-ui/core'

function loadScript(src, position, id) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  optionsLoading: {
    width: '18px',
    height: '18px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))

export default function GoogleMaps(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(null)
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState([])
  const loaded = React.useRef(false)
  const [loading, setLoading] = React.useState(false)
  const [highlightedOption, setHighlightedOption] = React.useState()


  if (typeof window !== 'undefined' && !loaded.current) {
    // if (!document.querySelector('#google-maps')) {
      // loadScript(
      //   'https://maps.googleapis.com/maps/api/js?key=AIzaSyBwRp1e12ec1vOTtGiA4fcCt2sCUS78UYc&libraries=places',
      //   document.querySelector('head'),
      //   'google-maps',
      // )
    // }

    loaded.current = true
  }

  const loadOption = (option) => {

    // console.log(option)
    autocompleteService.current.search(option, (error, data)  => {
      if (error) {
          // Handle search error
          return
      }
      var address = {}
      if(data.places != null){
        address = data.places[0]
      }

      const lat = address.coordinate.latitude
      const long = address.coordinate.longitude

      var new_address = address
      delete new_address._wpURL
      
      // console.log(address)
      props.returnSearchResult(new_address)
    })

  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        // console.log(request.input)
        setLoading(true)
        autocompleteService.current.autocomplete(request.input, callback)

      }, 200),
    [],
  )

  React.useEffect(() => {
    let active = true

    if (!autocompleteService.current) {
      autocompleteService.current = new mapkit.Search({getsUserLocation: true})
    }
    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValue === '') {
      setOptions(value ? [value] : [])
      return undefined
    }

    fetch({ input: inputValue }, (error, results) => {
      // console.log(results)
      if (active) {
        let newOptions = []

        if (value) {
          newOptions = [value]
        }

        if (results) {
          newOptions = [...newOptions, ...results.results]
          setLoading(false)
        }

        setOptions(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [value, inputValue, fetch])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      loadOption(highlightedOption)
    }
  }

  return (
    <Autocomplete
      id='autocomplete-search'
      style={{ width: '100%' }}
      getOptionLabel={(option) => {return option.displayLines ? option.displayLines[0] : option}}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      className={props.className}
      noOptionsText={loading ? <CircularProgress className={classes.optionsLoading} /> : 'Address not found'}
      value={value}
      onKeyDown={handleKeyDown}
      onHighlightChange={(event, option) => {
        setHighlightedOption(option)
      }}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options)
        setValue(newValue)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        setValue(newInputValue)
        if(props.returnInputValue){
          props.returnInputValue(newInputValue)
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label={props.textFieldLabel} variant='outlined' autoFocus helperText={props.helperText} fullWidth />
      )}
      renderOption={(option) => {

        if(!option.displayLines){
          return (
            <Grid container alignItems="center" onClick={(event) => {loadOption(option)}} >
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {option}
              </Grid>
            </Grid>
          )
        }

        var displayLine1 = option.displayLines[0] ? option.displayLines[0] : ''
        var displayLine2 = option.displayLines[1] ? option.displayLines[1] : ''

        if(displayLine2.includes('near ') || displayLine2.includes('Search Nearby')){
          return null
        }

        return (
          <Grid container alignItems="center" onClick={(event) => {loadOption(option)}}>
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {displayLine1}

              <Typography variant="body2" color="textSecondary">
                {/*option.structured_formatting.secondary_text*/}
                {displayLine2}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
