import React from 'react'

import { Redirect } from 'react-router-dom'


export default function DefaultRedirect (props) {

  return (<Redirect push to='/app/events' />)

}
