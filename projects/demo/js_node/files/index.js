import { globalGraph, getRegexGroups } from "../index.js";
import { getFileOptions } from "./options.js";
import Node from "../display/nodes.js";

var readFiles = [];
var readFileNodes = [];

export async function readFile(fileName="", nodeConnector){

	fileName = fileName.replaceAll("/./", "/");
	if(fileName.endsWith("/")) fileName += `index.html`;
	if(/\/(\w*)$/gm.test()) fileName += "."+nodeConnector.title.split(".")[nodeConnector.title.split(".").length-1]
	let fileID = `${fileName}`;
	while(fileID.startsWith(".")) fileID = fileID.replace(".", "");

	if(readFiles.includes(fileID)){
		let fileIndex = readFiles.indexOf(fileID);
		nodeConnector?.edgeTo(readFileNodes[fileIndex]);
		return undefined;
	}

	var fileNode = new Node(fileID, globalGraph);
	readFiles.push(fileID);
	readFileNodes.push(fileNode);

	// if(false){
	if(readFiles.length == 1){
		fileNode.moveTo(0, 0);
	}else{
		fileNode.moveTo(
			(Math.random() * globalGraph.canvas.width - globalGraph.canvas.width / 2),
			(Math.random() * globalGraph.canvas.height - globalGraph.canvas.height / 2)
		);
	}

	nodeConnector?.edgeTo(fileNode);

	let file = await fetch(fileName)
	let fileContents = await file.text();

	let linkRegex = getFileOptions(fileName).data?.links;

	linkRegex?.forEach((regex=new RegExp) => {
		let imports = getRegexGroups(regex, fileContents);

		imports.forEach((importFile=["fullstring", "group1", "filename"]) => {
			readFile(moveDirectory(fileName, importFile[1]), fileNode);
		});
	})
}

export function moveDirectory(oldDir="", appendDir=""){

	if(/^https{0,}:/g.test(appendDir)) return appendDir;
	if(/^data:/g.test(appendDir)) return appendDir+".png";

	oldDir = oldDir.replaceAll(/(\w{1,}\.\w{1,})/g, "");

	let propperDir = oldDir + "/" + appendDir;
	while(propperDir.includes("//")) propperDir = propperDir.replaceAll("//", "/");

	let iframe = document.createElement("iframe");
	iframe.src = propperDir;
	
	propperDir = new URL(iframe.src).pathname;
	while(propperDir.includes("//")) propperDir = propperDir.replaceAll("//", "/");

	return propperDir;
}