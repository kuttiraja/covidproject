var graphDataStructure = require("graph-data-structure") 
const employee = require('../db').employeeQueries
const Links = require('../db').LinksQueries
const Node = require('../db').NodeQueries
const AppConfig = require('../core').config
const logger = require('../core').logger

// var graph = graphDataStructure();


async function loadLinksFromDBToGraph() {

    // var graph = graphDataStructure();
    let links = await Links.retrieveAllLinkEmployees();
    // links.forEach(link => {
    //     graph.addEdge(link.source , link.target);
    // })
    return links;
    //Fetch records from Links DB
    //Update graph with nodes and edges(pre-Load while start of the app)
}

async function updateEmployeeLinksCovidIndicators(empLinkArray, covidImpactIndicator) {
    //Find the links for the employeeId
    // Update the linked employee's Indicators as below
    //if employId is red pass, update links with "Q"
    //if employId is yellow pass, update links with "M"(if no indicator, if Q - No update).
    //if employId is green pass, no action
    // console.log(graph)
    
    // let updateLinks = graph.depthFirstSearch(employeeId, false);
    // console.log(empLinkArray)
    let updateLinkEmployees = [];
    let linkedEmployees = await Node.retrievecustomNodeEmployees(empLinkArray);
    // console.log(linkedEmployees)

    linkedEmployees.forEach(employee => {
        if(isEmployeeEligibleForIndicatorUpdate(employee, covidImpactIndicator) === true){
            updateLinkEmployees.push(employee.employeeId);
        }
    })

    let linkcovidIndicatorUpdate = await findLinkCovidIndicator(covidImpactIndicator);
    
    console.log(updateLinkEmployees)
    if(Array.isArray(updateLinkEmployees) && updateLinkEmployees.length != 0) {
        await Node.updateEmployeeLinksCovidIndicators(updateLinkEmployees, linkcovidIndicatorUpdate);
    }
}

async function findLinkCovidIndicator(covidImpactIndicator) {
    switch(covidImpactIndicator) {
        case AppConfig.IMPACTED_COVID_INDICATOR:
            return AppConfig.QUARANTINE_COVID_INDICATOR
        case AppConfig.MONITOR_COVID_INDICATOR:
            return AppConfig.CONTACTTRACE_COVID_INDICATOR
        default:
            return AppConfig.NOIMPACT_COVID_INDICATOR
    }
}
function isEmployeeEligibleForIndicatorUpdate(employee, covidImpactIndicator) {

    logger.info(`Check for Indicator Update", Link Employee = ${employee.covidImpactIndicator}, Employee = ${covidImpactIndicator}`)
    
    switch(covidImpactIndicator) {
        case "I":
            if(employee.covidImpactIndicator ===  AppConfig.NOIMPACT_COVID_INDICATOR ||
                employee.covidImpactIndicator === AppConfig.CONTACTTRACE_COVID_INDICATOR ||
                employee.covidImpactIndicator === AppConfig.MONITOR_COVID_INDICATOR) {
                    return true;
                }
            else {
                return false
            }
            break;
        case "M":
            if(employee.covidImpactIndicator ===  AppConfig.NOIMPACT_COVID_INDICATOR ||
                employee.covidImpactIndicator === AppConfig.CONTACTTRACE_COVID_INDICATOR) {
                    return true;
                }
            else {
                return false
            }
            break;

        case "N":
        default:
            return false         
    }
}

async function updateEmployeeNodeCovidIndicators(employeeId, covidImpactIndicator) {
    
    let updatedEmployee = await Node.updateEmployeeNodeCovidIndicators(employeeId, covidImpactIndicator)
    logger.info("Updated Employee", updatedEmployee);
    return updatedEmployee;

}



module.exports = {
    loadLinksFromDBToGraph,
    updateEmployeeLinksCovidIndicators,
    updateEmployeeNodeCovidIndicators
}