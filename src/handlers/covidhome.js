const employeeModel = require('../models').employeeModel
const employee = require('../db').employeeQueries
const Node = require('../db').NodeQueries
const Links = require('../db').LinksQueries
const logger = require('../core').logger
const Graph = require('../graph').Graph
const AppConfig = require('../core').config

async function covidApiHome(req, res, next) {
    let response = {}
    var nodes = [] 
    let links = []

    try { 
        nodes = await Node.retrieveAllNodeEmployees();

        nodes.forEach(node => {
          switch(node.covidImpactIndicator) {
            case AppConfig.IMPACTED_COVID_INDICATOR: // RED - I
              node.color = AppConfig.IMPACTED_COVID_COLOR
              break;
            case AppConfig.QUARANTINE_COVID_INDICATOR:  // Light Red - Q
              node.color = AppConfig.QUARANTINE_COVID_COLOR
              break;
            case AppConfig.MONITOR_COVID_INDICATOR:  // YELLOW - M
              node.color = AppConfig.MONITOR_COVID_COLOR
              break;
            case AppConfig.CONTACTTRACE_COVID_INDICATOR:   // Light YELLOW - C
              node.color = AppConfig.CONTACTTRACE_COVID_COLOR
              break;
            case AppConfig.NOIMPACT_COVID_INDICATOR:  // GREEN - N
            default:
              node.color = AppConfig.NOIMPACT_COVID_COLOR
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
          // covidIndicator: "N"
        }
        // compute covid indicator for this employee and update in node
        // update the links DB as well
        await computeEmployeeCovidIndicator(personResponse);

        await employee.insertOrUpdateEmployeeAssistant(personResponse)
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

async function computeEmployeeCovidIndicator(employeeAssistantInput) {

  // let covidRank = computeCovidSeverity(employeeAssistantInput);
  console.log(employeeAssistantInput)
  if(employeeAssistantInput.havingCovid === true) {
    employeePass = AppConfig.IMPACTED_COVID_COLOR
    employeeIndicator = AppConfig.IMPACTED_COVID_INDICATOR
  }
  else if (employeeAssistantInput.havingFever === false &&
            employeeAssistantInput.travelOutside === false &&
            employeeAssistantInput.usedPublicTransport === false) {
              employeePass = AppConfig.NOIMPACT_COVID_COLOR
              employeeIndicator = AppConfig.NOIMPACT_COVID_INDICATOR
  }
  else {
    employeePass = AppConfig.MONITOR_COVID_COLOR
    employeeIndicator = AppConfig.MONITOR_COVID_INDICATOR
  }

  console.log(employeeIndicator)
  if(employeeIndicator !== AppConfig.NOIMPACT_COVID_INDICATOR) {
    // let empArray = []
    
    Graph.updateEmployeeNodeCovidIndicators(employeeAssistantInput.employeeId, employeeIndicator);

    let graph = await Graph.loadLinksFromDBToGraph(); 
    let empLinkArray = [];

    graph.forEach((link) => {
      if(link.source === employeeAssistantInput.employeeId) {
        empLinkArray.push(link.target);
      }
    })
    
    // empArray.push(employeeAssistantInput.employeeId)

    await Graph.updateEmployeeLinksCovidIndicators(empLinkArray,employeeIndicator);
  }
}

function computeCovidSeverity(input) {
  
  let count = 0;
  if(input.havingFever === true)
    count +=1;
  if (input.havingCovid === true)
    count +=1;
  if (input.usedPublicTransport === true)
    count +=1;
  if (input.travelOutside === true)
    count +=1; 

  return count;
}

module.exports = {
    covidApiHome,
    covidAssistant
}
