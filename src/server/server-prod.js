import path from 'path'
import express from 'express'
import webpack from 'webpack'
import main from './main.js'
const app = express()

// load common server config
main(app)
