const mongoose = require('mongoose')
const { logger, config } = require('../core')
mongoose.Promise = require('q').Promise
mongoose.set('debug', true)
const mongooseOptions = {
    reconnectTries: 120,
    reconnectInterval: 1000,
    useNewUrlParser: true
    // useMongoClient : true
}


// if (config.DB_HOST === 'localhost')
//     DB_URI = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_SCHEMA}`
// else
//     DB_URI = `mongodb://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_SCHEMA}`

// DB_URI = 
console.log(config.DB_URI)
async function connect() {
    await mongoose.connect(config.DB_URI, mongooseOptions)
}

module.exports = connect;