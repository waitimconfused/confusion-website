import { hideOptionsPane, globalGraph } from "./demo/js_node/index.js";
import Node from "./demo/js_node/display/nodes.js";
import { readFile } from "./demo/js_node/files/index.js";

hideOptionsPane();

globalGraph.disableEditing();

let homepage = (new Node)
	.setTitle("Confusion")
	.setGlyph("🏠")
	.setColour("#00FF00")
	.moveTo(0, 0);

let projectView = (new Node)
	.setTitle("Project Viewer")
	.setGlyph("👁️")
	.setColour("#00FF00");

let projectDemo = (new Node)
	.setTitle("Project Demos")
	.setGlyph("🪀")
	.setColour("#00FF00");

let projects = ["AAA", "BBB", "CCC"];

projects.forEach((project) => {
	let viewNode = new Node;
	let demoNode = new Node;
	viewNode.setTitle("view:"+project+".md");
	demoNode.setTitle("demo:"+project+"/");
	projectView.connectTo(viewNode);
	projectDemo.connectTo(demoNode);

});

homepage.connectTo(projectView);
homepage.connectTo(projectDemo);