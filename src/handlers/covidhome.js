const employeeModel = require('../models').employeeModel
const logger = require('../core').logger

async function covidApiHome(req, res, next) {
    res.status(200).send("Hello World")
}

async function covidAssistant(req, res, next) {

    let action;

    action = (req.body.queryResult ===undefined) ? null:
    (req.body.queryResult.action === undefined)? null : req.body.queryResult.action;

    parameters = req.body.queryResult ? (req.body.queryResult.parameters ?req.body.queryResult.parameters : null)  : null

    if(action!= null && action != ""){
        let personResponse = new employeeModel(parameters)

        try {
            await personResponse.save();
            logger.info("User Details saved")
        }
        catch(err) {
            logger.error("User details save error", err)
        }
    }
    responseObject = {
        fulfillmentMessages: [
          {
            text: {
              text: [
                "Thank you for providing the response. We would notify security for next steps."
              ]
            }
          }
        ]
      }
    res.status(200).send(responseObject)
}

module.exports = {
    covidApiHome,
    covidAssistant
}
