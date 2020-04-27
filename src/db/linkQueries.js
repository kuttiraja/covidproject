const LinkEmployees = require('../models').LinksEmployees
const logger = require('../core').logger

async function retrieveAllLinkEmployees() {
    let linkEmployees = [];
    try {
        linkEmployees = LinkEmployees.find({}).lean()
    }
    catch (err) {
        logger.info("Fetch Links Failed");
    }
    return linkEmployees;
}

module.exports = {
    retrieveAllLinkEmployees
}