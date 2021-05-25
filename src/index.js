import React from 'react'
import ReactDOM from 'react-dom'
import App from './ui/App.js'

ReactDOM.render(<App />, document.getElementById('render-target'))

// Needed for Hot Module Replacement
// Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload. This can significantly speed up development
if (typeof (module.hot) !== 'undefined') { // eslint-disable-line no-undef
  console.log('hot reload enabled')
  module.hot.accept() // eslint-disable-line no-undef
}
