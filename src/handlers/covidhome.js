
async function covidApiHome(req, res, next) {
    res.status(200).send("Hello World")
}

async function covidAssistant(req, res, next) {
    res.status(200).send("Hello World -1")
}

module.exports = {
    covidApiHome,
    covidAssistant
}
