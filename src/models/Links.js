const mongoose = require('mongoose')
const Types = mongoose.Schema.Types
const LinkSchema = new mongoose.Schema({
    source: Types.Number,
    target: Types.Number,
    weight: Types.Number
})

const Link = mongoose.model('link', LinkSchema)
module.exports = Link
