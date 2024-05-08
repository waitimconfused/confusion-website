console.clear();

import fs, { readFileSync } from "node:fs";
import node_path from "node:path";

const relativeOutput = "./Asterisk/";
const startingFile = "https://dev-384.github.io/confusion-projects/asterisk/index.js"

removeFolder(relativeOutput);

function createFolder(path=""){
	if(!path.endsWith("/")) path += "/";
	if(!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}
function removeFolder(path=""){
	fs.rmSync(path, { recursive: true, force: true });
}

function createFile(path="", content=""){
	createFolder(node_path.dirname(path));
	fs.writeFileSync(path, content);
}

async function downloadFromGithub(username="", repo="", path="", downloadDir=""){
	let response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`);
	if(response.status != 200) return;
	let fileContents = await response.json();

	for(let i = 0; i < fileContents.length; i++){
		let folderItem = fileContents[i];
		let localPath = folderItem.path.replace(path, "");
		if(folderItem.type == "dir"){
			createFolder(downloadDir+"/"+localPath);
			downloadFromGithub(username, repo, folderItem.path, downloadDir+"/"+localPath);
			continue;
		}
		let response = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${folderItem.path}`);
		let fileContent = await response.text();
		createFile(downloadDir+"/"+localPath, fileContent);
		console.log(downloadDir+"/"+localPath);
	}
}

downloadFromGithub("Dev-384", "confusion-projects", "asterisk", "Asterisk");

var json = fs.existsSync(relativeOutput+"/package.json")?readFileSync(relativeOutput+"/package.json"):"{}";
json = JSON.parse(json);
json.type = "module";
json.scripts = json.scripts || {};
json.scripts["ast-host"] = "node host.ast.js";
json.scripts["ast-install"] = "node install.ast.js";
createFile(relativeOutput+"/package.json", JSON.stringify(json, null, 4));