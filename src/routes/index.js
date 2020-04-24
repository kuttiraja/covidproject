const covidHandler = require('../handlers').covidHandler
const heartbeatHandler = require('../handlers').heartbeatHandler

const router = require('express').Router()

router.get("/", covidHandler.covidApiHome)
router.post("/", covidHandler.covidAssistant)
router.get("/heartbeat", heartbeatHandler.heartbeat);

module.exports = router