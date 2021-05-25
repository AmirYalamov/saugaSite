import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Cookies from 'universal-cookie'

import UserContext from './contexts/UserContext.js'

import history from './history.js'

import ExamplePage from './pages/Example/Example.jsx'

import ResidentIndex from './pages/ResidentPortal/Index.jsx'
import AdminIndex from './pages/AdminPanel/Index.jsx'

// polyfills
// URLSearchParams
import 'url-search-params-polyfill'
// ie9 - 10 - 11
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

// components

/* internal css */
import './main.scss'

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const cookies = new Cookies()

const axios = require('axios').default

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#D1C4E9',
      main: '#673AB7',
      dark: '#4527A0',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#BBDEFB',
      main: '#9C27B0',
      dark: '#1565C0',
      contrastText: '#ffffff'
    }

  }
})

// App component - represents the whole app
class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      logged_in: true,
      user: {}
    }

    axios.get('/v1/login')
      .then((response) => {
        if (response) {
          cookies.set('logged_in', true, { path: '/' })
          this.setState({ user: response.data })
          console.log(response.data)
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          cookies.set('logged_in', false, { path: '/' })
        }
      })

    cookies.addChangeListener((cookie) => {
      console.log(`${cookie.name} - ${cookie.value}`)
      if (cookie.name == 'logged_in') {
        this.setState({ logged_in: cookie.value })
      }
    })
  }

  render () {
    return (
      <div className='app'>
        <UserContext.Provider value={this.state.user}>
          <ThemeProvider theme={theme}>
            <Router history={history}>
              <Switch>
                <Route exact path='/admin/*' component={AdminIndex} />
                <Route exact path='/admin' component={AdminIndex} />
                <Route exact path='/*' component={ResidentIndex} />
              </Switch>
            </Router>
          </ThemeProvider>
        </UserContext.Provider>
      </div>
    )
  }
}

export default App
