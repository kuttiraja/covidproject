const employeeModel = require('../models').employeeModel
const employee = require('../db').employeeQueries
const Node = require('../db').NodeQueries
const Links = require('../db').LinksQueries
const logger = require('../core').logger
const Graph = require('../graph').Graph

async function covidApiHome(req, res, next) {
    let response = {}
    var nodes = [] 
    let links = []

    // console.log(graph)
    



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

  let covidRank = computeCovidSeverity(employeeAssistantInput);
  switch(covidRank) {
    case 0 :
      employeePass = "green"  // No Action
      break;
    case 1:
    case 2:
      employeePass = "yellow"  // Update Links to Monitor, employee Indicator to "M"
      break;
    case 3:
    case 4:
        employeePass = "red"  // Update Employee Indicator to "R",Update Links to Quarantine
        break;
    default:
        employeePass = "green"
        break;
  }
  //Update Node
  // updatedNode = await Node.
  if(employeePass != "green") {
    let empArray = []
    let graph = await Graph.loadLinksFromDBToGraph();
    Graph.updateEmployeeNodeCovidIndicators(employeeAssistantInput.employeeId, employeePass)
    
    empArray.push(employeeAssistantInput.employeeId)
    await Graph.updateEmployeeLinksCovidIndicators(graph, empArray,employeePass);
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
