import { globalGraph, getRegexGroups } from "../index.js";
import { getFileOptions } from "./options.js";
import Node from "../display/nodes.js";

var readFiles = [];
var readFileNodes = [];

function delay(ms=1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function readFile(fileName="", nodeConnector){

	if(readFileNodes.length > 10) return;

	fileName = fileName.replaceAll("/./", "/");
	// if(fileName.endsWith("/")) fileName += `index`;
	if(/\/(\w*)$/gm.test()) fileName += "."+nodeConnector.title.split(".")[nodeConnector.title.split(".").length-1]
	let fileID = `${fileName}`;
	if(nodeConnector) while(fileID.startsWith(".")) fileID = fileID.replace(".", "");

	if(readFiles.includes(fileID)){
		let fileIndex = readFiles.indexOf(fileID);
		nodeConnector.connectTo(readFileNodes[fileIndex]);
		return undefined;
	}

	var fileNode = new Node(fileID, globalGraph);
	fileNode.setValue(fileName);
	readFiles.push(fileID);
	readFileNodes.push(fileNode);

	if(readFiles.length == 1){
		fileNode.moveTo(0, 0);
	}else{
		fileNode.moveTo(
			(Math.random() * globalGraph.canvas.width - globalGraph.canvas.width / 2),
			(Math.random() * globalGraph.canvas.height - globalGraph.canvas.height / 2)
		);
	}

	nodeConnector?.connectTo(fileNode);

	let file = await fetch(fileName, {
		mode: 'no-cors'
	});
	if(file.status == "404") {
		fileNode.setTitle("404");
		fileNode.display.glyph = "404";
	}
	let fileContents = await file.text();
	let options = getFileOptions(fileName).data;
	let linkRegex = options?.links;
	let fileImportIndex = options?.linkPathIndex || 0;

	for(let linkRegexIndex = 0; linkRegexIndex < (linkRegex.length || 0); linkRegexIndex ++){
		let regex = linkRegex[linkRegexIndex];
		let imports = getRegexGroups(regex, fileContents);

		for(let importIndex = 0; importIndex < imports.length; importIndex ++){
			let importFile = imports[importIndex];
			readFile(moveDirectory(fileName, importFile.at(fileImportIndex+1)), fileNode);
		}
	}
}

export function moveDirectory(oldDir="", appendDir=""){

	if(/^https{0,1}:/g.test(appendDir)) return appendDir;
	if(/^data:/g.test(appendDir)) return appendDir+".png";

	if(appendDir.startsWith("/")) return appendDir;

	oldDir = oldDir.replaceAll(/(\w{1,}\.\w{1,})/g, "");

	let propperDir = oldDir + "/" + appendDir;
	while(propperDir.includes("//")) propperDir = propperDir.replaceAll("//", "/");

	let iframe = document.createElement("iframe");
	iframe.src = propperDir;
	
	propperDir = new URL(iframe.src).pathname;
	while(propperDir.includes("//")) propperDir = propperDir.replaceAll("//", "/");

	return propperDir;
}