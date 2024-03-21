console.clear();

import fs, { readFileSync } from "node:fs";
import node_path from "node:path";

const relativeOutput = "./";
const startingFile = "https://raw.githubusercontent.com/Dev-384/confusion-website/main/server.ast.js"

function createFolder(path){
	if(!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

function createFile(path, content){
	createFolder(node_path.dirname(path));
	fs.writeFileSync(path, content);
}


async function readFileFromURL(url=""){
	let response = await fetch(url);
	let content = await response.text();
	return content;
}

const importRegex = /(import|export) ([*\w]+ as \w+|[\w \{\}]+?) from "(.+?)"/g;
async function recursiveImport(mainFilePath="", relativePath){
	let fileContent = await readFileFromURL(mainFilePath);
	let importStatements = fileContent.match(importRegex);
	if(!importStatements) return;
	importStatements.forEach(async (statement) => {
		let dir = node_path.dirname(mainFilePath);
		let importedPath = statement.split(importRegex)[3];
		if(importedPath.startsWith("node")) return;
		let importedFile = await readFileFromURL(dir + "/" + importedPath);
		createFile(relativePath + "/" + importedPath, importedFile);
		let newRelativeDir = node_path.dirname(relativePath + "/" + importedPath);
		recursiveImport(dir + "/" + importedPath, newRelativeDir);
	});
}

recursiveImport(startingFile, "./");

if(!fs.existsSync(relativeOutput+"/server.ast.js")){
	let serverFile = await readFileFromURL(startingFile)
	createFile(relativeOutput+"/server.ast.js", serverFile);
}

var json = fs.existsSync(relativeOutput+"/package.json")?readFileSync(relativeOutput+"/package.json"):"{}";
json = JSON.parse(json);
json.type = "module";
json.scripts = json.scripts || {};
json.scripts["ast-host"] = "node host.ast.js";
json.scripts["ast-install"] = "node install.ast.js";
createFile(relativeOutput+"/package.json", JSON.stringify(json, null, 4));