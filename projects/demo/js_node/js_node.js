import Node from "./display/nodes.js";
import { readFile } from "./files/index.js";
import { globalGraph } from "./index.js";

globalGraph.disableEditing();

// const addNode = document.createElement("button");
// addNode.innerText = "Create Node";
// document.body.appendChild(addNode);

// addNode.onclick = () => {
// 	new Node()
// 		// .moveTo(0, 0);
// }

// const node1 = new Node("Node 1");
// const node2 = new Node("Node 2");
// const node3 = new Node("Node 3");

// node1.connectTo(node2);
// node1.connectTo(node3);

// const node4 = new Node("Node 4");
// const node5 = new Node("Node 5");

// node2.connectTo(node4);
// // node2.connectTo(node5);

// // readFile("./js_node.html")

// readFile("./index.html");

// readFile("/index.html");

readFile("/404.html");

readFile("/projects/demo.html");
readFile("/projects/view.html");