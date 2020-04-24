const mongoose = require('mongoose')
const Types = mongoose.Schema.Types
const employeeSchema = new mongoose.Schema({
    employeeId: Types.Number,
    employeeName: Types.String,
    phoneNumber: Types.String
})

const employeeModel = mongoose.model('employee', employeeSchema)
module.exports = employeeModel
