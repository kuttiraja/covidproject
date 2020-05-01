const employeeModel = require('../models').employeeModel
const employee = require('../db').employeeQueries
const Node = require('../db').NodeQueries
const Links = require('../db').LinksQueries
const logger = require('../core').logger
const Graph = require('../graph').Graph
const AppConfig = require('../core').config
const SendMailNotification = require('../mail').sendemail

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
    // logger.info(req.body)
    let responseObject = {}
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
        let covidEmployeeRank = await computeEmployeeCovidIndicator(personResponse);

        await employee.insertOrUpdateEmployeeAssistant(personResponse)
    
    responseObject = {
      fulfillmentText : covidEmployeeRank.responseMessage,
      fulfillmentMessages : [{
          platform: "ACTIONS_ON_GOOGLE",
          simpleResponses: {
            simpleResponses: [{
              textToSpeech: covidEmployeeRank.responseMessage 
            }]
          }

      }]
    }
  }
  else {
    responseObject = {
      fulfillmentText : "Your response is not saved. Please try again",
      fulfillmentMessages : [{
          platform: "ACTIONS_ON_GOOGLE",
          simpleResponses: {
            simpleResponses: [{
              textToSpeech: "Your response is not saved. Please try again" 
            }]
          }

      }]
    }
  }
  res.status(200).send(responseObject)
}

async function computeEmployeeCovidIndicator(employeeAssistantInput) {

  let covidRank = {}
  if(employeeAssistantInput.havingCovid === true) {
    covidRank.color = "Red"
    covidRank.employeePass = AppConfig.IMPACTED_COVID_COLOR
    covidRank.employeeIndicator = AppConfig.IMPACTED_COVID_INDICATOR
    covidRank.responseMessage = "Thank you. As you have COVID exposure, please follow CDC regulations for self-quarantine"
  }
  else if (employeeAssistantInput.havingFever === false &&
            employeeAssistantInput.travelOutside === false &&
            employeeAssistantInput.usedPublicTransport === false) {
              covidRank.color = "Yellow"
              covidRank.employeePass = AppConfig.NOIMPACT_COVID_COLOR
              covidRank.employeeIndicator = AppConfig.NOIMPACT_COVID_INDICATOR
              covidRank.responseMessage = "Thank you. You are all good to go. Show the self-screening message to security for building entry"
  }
  else {
    covidRank.color = "GREEN"
    covidRank.employeePass = AppConfig.MONITOR_COVID_COLOR
    covidRank.employeeIndicator = AppConfig.MONITOR_COVID_INDICATOR
    covidRank.responseMessage = "Thank you. Please show the self-screening message to security and follow their direction"
  }

  // console.log(employeeIndicator)
  let employeeIndicator = covidRank.employeeIndicator
  if(employeeIndicator !== AppConfig.NOIMPACT_COVID_INDICATOR) {
    // let empArray = []
    
    updatedEmployee = await Graph.updateEmployeeNodeCovidIndicators(employeeAssistantInput.employeeId, employeeIndicator);
    // console.log(updatedEmployee)

    if(updatedEmployee != null) {
      let message = ` 
      Hi ${updatedEmployee.employeeName}, <br></br>
           ${covidRank.responseMessage} <br
      <p> Your Details: <br>
                    Name : ${updatedEmployee.employeeName} <br>
                    Seat Location: ${updatedEmployee.seatNo} <br>
                    <br>
                    Pass Color: ${covidRank.color} <br>
                    <br
                    Questions Answered: <br>
                       1. Travelled Outside? : ${employeeAssistantInput.travelOutside} <br>
                       2. Covid Contact? : ${employeeAssistantInput.havingCovid} <br>
                       3. Fever? : ${employeeAssistantInput.havingFever} <br> 
                       4. Public Transport used? : ${employeeAssistantInput.usedPublicTransport} <br>`
    
    let subject = `Your Pass Information`
    await SendMailNotification.sendEmailNotification(subject, message);
    }
    
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

  return covidRank;
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
