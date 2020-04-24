
async function heartbeat(req, res, next) {
    res.status(200).send("Heartbeat detected");
}

module.exports = {
    heartbeat
}