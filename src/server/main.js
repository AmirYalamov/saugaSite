import '@babel/polyfill'

import dotenv from 'dotenv'
import router from './routes/router'
import express from 'express'
import path from 'path'
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('./passport/setup')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

export default function (app) {
  dotenv.config({
    path: `${process.env.PWD}/.env`
  })

  // configure DB
  const MONGO_URI = process.env.MONGO_URL
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log(`MongoDB connected ${MONGO_URI}`))
    .catch(err => console.log(err))

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // express session
  app.use(
    session({
      secret: 'thisisthesecretforoursessions',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
  )

  // Passport middleware
  app.use('/v1', passport.initialize())
  app.use('/v1', passport.session())

  // initialize router
  router(app)

  // some top level routes
  app.get('/img*', (req, res) => {
    res.sendFile(path.join(__dirname + req.originalUrl))
  })

  app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/main.js'))
  })

  app.get('/main.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/main.css'))
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
  })

  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
  })
}
