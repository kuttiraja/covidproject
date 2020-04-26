const employeeModel = require('../models').employeeModel
const employee = require('../db').employeeQueries
const Node = require('../db').NodeQueries
const Links = require('../db').LinksQueries
const logger = require('../core').logger

async function covidApiHome(req, res, next) {
    //Fetch details from Links/Nodes and construct the graph structure
    // send to UI with below structures
    // // {
    //     nodes: [{}],
    //     links: [{}]
    // }
    let response = {}
    var nodes = [] 
    let links = []

    try { 
        nodes = await Node.retrieveAllNodeEmployees();

        nodes.forEach(node => {
          switch(node.covidImpactIndicator) {
            case "R":
              node.color = "red"
              break;
            case "Q":
              node.color = "orange"
              break;
            case "M":
              node.color = "yellow"
              break;
            case "N":
              node.color = "green"
              break;
            default:
              node.color = "black"
              break;
          }
        })
    }
    catch (err) {
        logger.info("retrieveAllNodeEmployees failed",err)
    }
    try {
       links = await Links.retrieveAllLinkEmployees()
    }
    catch(err) {
        logger.info("retrieveAllLinkEmployees failed", err)
    }
    response.nodes = nodes
    response.links = links
    res.status(200).send(response)
}

async function covidAssistant(req, res, next) {

    let action;

    action = (req.body.queryResult ===undefined) ? null:
    (req.body.queryResult.action === undefined)? null : req.body.queryResult.action;

    parameters = req.body.queryResult ? (req.body.queryResult.parameters ?req.body.queryResult.parameters : null)  : null

    if(action!= null && action != ""){
        let personResponse = {
          travelOutside: parameters.travelOutside === "false" ? false : true,
          usedPublicTransport: parameters.usedPublicTransport === "false" ? false : true,
          havingCovid: parameters.havingCovid === "false" ? false : true,
          havingFever: parameters.havingFever === "false" ? false : true,
          employeeId: parameters.employeeId,
          employeeName: parameters.employeeName,
          covidIndicator: "N"
        }
        await employee.insertOrUpdateEmployeeAssistant(personResponse)
        // let assistantDetails = new employeeModel(personResponse)

        // try {

        //     await assistantDetails.save();
        //     logger.info("User Details saved")
        // }
        // catch(err) {
        //     logger.error("User details save error", err)
        // }
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
