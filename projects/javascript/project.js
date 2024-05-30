import { hideOptionsPane, globalGraph, camera } from "https://dev-384.github.io/confusion-projects/js_node/index.js";
import Node from "https://dev-384.github.io/confusion-projects/js_node/display/nodes.js";
// import { Octokit } from "https://esm.sh/octokit";

// const octokit = new Octokit({ auth: "" });

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
	.moveTo(0, 0);

let projectView = (new Node)
	.setTitle("View")
	.setGlyph("👁️")
	.setColour("#FFB3B3");

let projectDemo = (new Node)
	.setTitle("Demo")
	.setGlyph("🪀")
	.setColour("#FFB3B3");

homepage.connectTo(projectView);
homepage.connectTo(projectDemo);

async function getGithubContents(path=""){
	let response = await fetch("https://api.github.com/repos/Dev-384/github-projects/git/trees/main?recursive=1");
	let result = await response.json();

	// await octokit.rest.repos.getContent({
	// 	owner: "Dev-384",
	// 	repo: "confusion-projects",
	// 	path: path
	// })

	let data = result.data;
	return data;
}

let json = await getGithubContents("");
let projects = json.map((file) => {
	return (file.type == "dir")?file.name:undefined
});

for(let i = 0; i < projects.length; i++){
	let projectPath = projects[i];

	let json = await getGithubContents(projectPath);

	console.log(json);

	let fileNames = json.map((file) => {
		return (file.type == "file")?file.name:undefined
	});

	if(!fileNames.includes("readme.md") && !fileNames.includes("README.md") && !fileNames.includes("readme") && !fileNames.includes("README")){
		continue;
	}

	let projectName = projectPath.replace(/\.\w+?$/, "");
	let viewNode = new Node;
	viewNode.setTitle(projectName);
	viewNode.setColour("#E06767");
	viewNode.setGlyph("📁");
	viewNode.addEventListener("dblclick", () => {
		window.open(`/projects/view?project=${projectName}`);
	});
	viewNode.setAttribute("title", "Double click to open project");
	projectView.connectTo(viewNode);
}