const mongoose = require('mongoose')
const Types = mongoose.Schema.Types
const employeeSchema = new mongoose.Schema({
    employeeId: Types.Number,
    employeeName: Types.String,
    phoneNumber: Types.String,
    travelOutside: Types.Boolean,
    usedPublicTransport: Types.Boolean,
    havingCovid: Types.Boolean,
    havingFever: Types.Boolean,
    securityNotified: Types.Boolean,
    securityNotification: Types.String
})

const employee = mongoose.model('employee', employeeSchema)
module.exports = employee
