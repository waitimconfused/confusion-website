import { hideOptionsPane, globalGraph, camera } from "./js_node/index.js";
import Node from "./js_node/display/nodes.js";

hideOptionsPane();

globalGraph.disableEditing();
globalGraph.setBG("#151515");
globalGraph.setSize(500, 500);
globalGraph.styles.text.minimumZoom = 0.5;
globalGraph.styles.line.size = 4;
camera.setDefaultZoom(1.5);
globalGraph.setLineColour("#232323");

let homepage = (new Node)
	.setTitle("Confusion")
	.setGlyph("🏠")
	.setColour("#FFB3B3")
	.moveTo(0, 0);

let projectView = (new Node)
	.setTitle("View")
	.setGlyph("👁️")
	.setColour("#FFB3B3");

let projectDemo = (new Node)
	.setTitle("Demo")
	.setGlyph("🪀")
	.setColour("#FFB3B3");

let response = await fetch('https://api.github.com/repos/Dev-384/confusion-website/contents/projects/markdown');
let json = await response.json();
let projects = json.map(file => file.name);

projects.forEach((project="") => {
	let projectName = project.replace(/\.\w+?$/, "");
	let viewNode = new Node;
	viewNode.setTitle(projectName);
	viewNode.setColour("#E06767");
	viewNode.setGlyph("📁");
	viewNode.addEventListener("dblclick", () => {
		window.open(`/projects/view?project=${projectName}`)
	})
	projectView.connectTo(viewNode);

});

homepage.connectTo(projectView);
homepage.connectTo(projectDemo);