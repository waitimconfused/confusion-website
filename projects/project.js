import { hideOptionsPane, globalGraph, camera } from "./demo/js_node/index.js";
import Node from "./demo/js_node/display/nodes.js";
import { readFile } from "./demo/js_node/files/index.js";

hideOptionsPane();

// globalGraph.disableEditing();
globalGraph.setBG("#151515");
globalGraph.setSize(500, 500);
camera.setDefaultZoom(1);
globalGraph.setLineColour("#232323");

let homepage = (new Node)
	.setTitle("Confusion")
	.setGlyph("🏠")
	.setColour("#FFB3B3")
	.moveTo(0, 0);

let projectView = (new Node)
	.setTitle("Project Viewer")
	.setGlyph("👁️")
	.setColour("#FFB3B3");

let projectDemo = (new Node)
	.setTitle("Project Demos")
	.setGlyph("🪀")
	.setColour("#FFB3B3");

let response = await fetch('https://api.github.com/repos/Dev-384/confusion-website/contents/projects/markdown');
let json = await response.json();
let projects = json.map(file => file.name);

projects.forEach((project) => {
	let viewNode = new Node;
	viewNode.setTitle("view:"+project);
	viewNode.setColour("#E06767");
	viewNode.setGlyph("📁");
	projectView.connectTo(viewNode);

});

homepage.connectTo(projectView);
homepage.connectTo(projectDemo);