const connect = require('./db')
const mongoose = require('mongoose')
const employeeQueries = require('./employeeQueries')
const NodeQueries = require('./nodeQueries')
const LinksQueries = require('./linkQueries')

module.exports = {
    connect,
    mongoose,
    employeeQueries,
    NodeQueries,
    LinksQueries
}
