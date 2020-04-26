var graphDataStructure = require("graph-data-structure") 

var graph = graphDataStructure();

graph.addNode("a");
graph.addNode("b");
graph.addNode("c");
graph.addNode("d");
graph.addNode("e");
graph.addNode("f");
graph.addEdge("a", "b");
graph.addEdge("b", "c");
graph.addEdge("b", "d");
graph.addEdge("b", "e");
graph.addEdge("d", "f");

// graph.topologicalSort();.dep
// graph.nodes();
graph.depthFirstSearch(["b"], false)

