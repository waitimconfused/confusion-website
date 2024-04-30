import { hideOptionsPane, globalGraph, setCustomScript } from "./demo/js_node/index.js";
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

let response = await fetch('https://api.github.com/repos/Dev-384/confusion-website/contents/projects/markdown');
let json = await response.json();
let projects = json.map(file => file.name);

projects.forEach((project) => {
	let viewNode = new Node;
	// let demoNode = new Node;
	viewNode.setTitle("view:"+project+".md");
	// demoNode.setTitle("demo:"+project+"/");
	projectView.connectTo(viewNode);
	// projectDemo.connectTo(demoNode);

});

homepage.connectTo(projectView);
homepage.connectTo(projectDemo);