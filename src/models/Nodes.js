const mongoose = require('mongoose')
const Types = mongoose.Schema.Types
const NodeSchema = new mongoose.Schema({
    employeeId: Types.Number,
    employeeName: Types.String,
    seatNo: Types.Number,
    covidImpactIndicator: Types.String
})

const Node = mongoose.model('node', NodeSchema)
module.exports = Node
