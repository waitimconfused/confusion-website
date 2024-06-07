import { hideOptionsPane, globalGraph, camera } from "https://dev-384.github.io/confusion-projects/js_node/index.js";
import Node from "https://dev-384.github.io/confusion-projects/js_node/display/nodes.js";
import projectList from "https://dev-384.github.io/confusion-projects/projects.json" with { type: "json" };

hideOptionsPane();

globalGraph.disableEditing();
globalGraph.setBG("#0b0b0b");
globalGraph.setSize(500, 500);
globalGraph.styles.text.minimumZoom = 0.5;
globalGraph.styles.line.size = 4;
camera.setDefaultZoom(1.5);
globalGraph.setLineColour("#232323");

let homepage = (new Node)
	.setTitle("Confusion")
	.setGlyph("🏠")
	.setColour("#FFB3B3")
	.moveTo(0, 0)
	.setAttribute("title", "Double click to go home")
	.addEventListener("dblclick", () => {
		window.open(`/`, "_self");
	});

let projectView = (new Node)
	.setTitle("View")
	.setGlyph("👁️")
	.setColour("#FFB3B3")
	.setAttribute("title", "Currently visiting");

let projectDemo = (new Node)
	.setTitle("Demo")
	.setGlyph("🖥️")
	.setColour("#FFB3B3")
	.setAttribute("title", "Double click to view project demos")
	.addEventListener("dblclick", () => {
		window.open(`/projects/demo`, "_self");
	});

homepage.connectTo(projectView);
homepage.connectTo(projectDemo);

load(projectList, 0);

function load(projects=[], index=0){

	let projectData = projects[index];

	if(projectData.readme){
		let viewNode = new Node;
		viewNode.setTitle(projectData.title);
		viewNode.setColour("#E06767");
		viewNode.setGlyph("📁");
		viewNode.addEventListener("dblclick", () => {
			window.open(`/projects/view?project=${projectData.title}`);
		});
		viewNode.setAttribute("title", "Double click to open");
		projectView.connectTo(viewNode);
	}

	if(projectData.link){
		let demoNode = new Node;
		demoNode.setTitle(projectData.title);
		demoNode.setColour("#E06767");
		demoNode.setGlyph("🖥️");
		if(projectData.link.startsWith("/")) {
			demoNode.addEventListener("dblclick", () => {
				window.open(`/projects/demo?project=${projectData.title}`);
			});
		}else{
			demoNode.addEventListener("dblclick", () => {
				window.open(projectData.link);
			});
		}
		demoNode.setAttribute("title", "Double click to open");
		projectDemo.connectTo(demoNode);
	}

	createCard(projectData);

	window.requestAnimationFrame(() => {
		load(projects, index+1);
	});
}

function createCard(projectData){
	let cardHolder = document.getElementById("project-cards");
	let card = document.createElement("div");
	cardHolder.appendChild(card);
	card.classList.add("card");
	let title = document.createElement("h2");
	card.appendChild(title);
	title.innerText = projectData.title;
}