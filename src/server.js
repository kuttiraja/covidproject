const express = require('express')
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require("body-parser")
const cors = require('cors')
const router = require('./routes')

const { logger, config } = require('./core')

//Global Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const corsOptions = {
    origin: 'http://localhost',
    optionSuccessStatus: 200
}
app.use(cors())


//Dynamic Route Imports & Adding to Express Middleware
app.use("/" , router);

logger.info(`server() - Logging enabled to [${config.LOG_TO_FILE_OR_CONSOLE}]`)
app.use(morgan('combined', { stream: logger.stream }))

module.exports = {
    server: app
}
