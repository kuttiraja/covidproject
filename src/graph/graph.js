var graphDataStructure = require("graph-data-structure") 
const employee = require('../db').employeeQueries
const Links = require('../db').LinksQueries
const Node = require('../db').NodeQueries

// var graph = graphDataStructure();


async function loadLinksFromDBToGraph() {

    var graph = graphDataStructure();
    let links = await Links.retrieveAllLinkEmployees();
    links.forEach(link => {
        graph.addEdge(link.source , link.target);
    })
    return graph;
    //Fetch records from Links DB
    //Update graph with nodes and edges(pre-Load while start of the app)
}

async function updateEmployeeLinksCovidIndicators(graph, employeeId, pass) {
    //Find the links for the employeeId
    // Update the linked employee's Indicators as below
    //if employId is red pass, update links with "Q"
    //if employId is yellow pass, update links with "M"(if no indicator, if Q - No update).
    //if employId is green pass, no action
    // console.log(graph)
    let updateLinks = graph.depthFirstSearch(employeeId, false);
    console.log(updateLinks)
    let linkedemployees = []
    updateLinks.forEach(element => {
        if(pass === 'red') {
            // Update employee's covid indicator to Q
            linkedemployees.push({
                employeeId : element,
                covidIndicator : "Q"
            })
        }
        else if (pass == 'yellow') {
            linkedemployees.push({
                employeeId : element,
                covidIndicator : "M"
            })
        }
    });
    await Node.updateEmployeeLinksCovidIndicators(linkedemployees);
}

async function updateEmployeeNodeCovidIndicators(employeeId, pass) {
    let covidImpactIndicator = "N";
    switch(pass) {
        case "red":
            covidImpactIndicator = "R"
            break;
        case "orange":
            covidImpactIndicator = "Q"
            break;
        case "yellow":
            covidImpactIndicator = "M"
            break;
        default:
            covidImpactIndicator = "N"
            break;
    }
    await Node.updateEmployeeNodeCovidIndicators(employeeId, covidImpactIndicator)

}



module.exports = {
    loadLinksFromDBToGraph,
    updateEmployeeLinksCovidIndicators,
    updateEmployeeNodeCovidIndicators
}