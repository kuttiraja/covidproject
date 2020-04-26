var graphDataStructure = require("graph-data-structure") 
const employee = require('../db').employeeQueries

var graph = graphDataStructure();

// graph.addNode("a");
// graph.addNode("b");
// graph.addNode("c");
// graph.addNode("d");
// graph.addNode("e");
// graph.addNode("f");
// graph.addEdge("a", "b");
// graph.addEdge("b", "c");
// graph.addEdge("b", "d");
// graph.addEdge("b", "e");
// graph.addEdge("d", "f");

// graph.topologicalSort();.dep
// graph.nodes();
// graph.depthFirstSearch(["b"], false)

async function loadLinksFromDBToGraph() {
    //Fetch records from Links DB
    //Update graph with nodes and edges(pre-Load while start of the app)
}

async function updateNodesCovidIndicators(employeeId, pass) {
    //Find the links for the employeeId
    // Update the linked employee's Indicators as below
    //if employId is red pass, update links with "Q"
    //if employId is yellow pass, update links with "M"(if no indicator, if Q - No update).
    //if employId is green pass, no action
    let updateLinks = graph.depthFirstSearch(employeeId, false);
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
        employee.updateEmployeeCovidIndicators(linkedemployees);
    });
}



module.exports = {
    loadLinksFromDBToGraph,
    updateNodesCovidIndicators
}