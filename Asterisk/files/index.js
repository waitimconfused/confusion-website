import * as fs from "node:fs";
import * as MESSAGES from "../messages/index.js";
import TYPES from "./types.json" assert {type: "json"};

export var visibility = true;
export var whitelist = [];

export function hide(){
	visibility = false;
}
export function show(){

	visibility = true;
}

export function get(path=""){
	if(path.startsWith("./") == false){
		if(path.startsWith("/") == false) path = "/" + path;
		if(path.startsWith(".") == false) path = "." + path;
	}

	if(visibility == false) return {
		type: "text/plain",
		content: MESSAGES.code("403", path)
	};

	if(path.split(/(\w*\.\w*)$/).length == 1 && !path.endsWith("/")){
			if(fs.existsSync(path+".html")) path += ".html";
	}

	if(fs.existsSync(path) == false) return {
		type: "text/plain",
		content: MESSAGES.code("404", path),
	}

	if(path.endsWith("/")){
		let message = "";

		if(fs.existsSync(path+"/index.html")){
			message = fs.readFileSync(path+"/index.html");
		}

		if(message == "") return {
			type: "text/plain",
			content: MESSAGES.code("404-dir", path),
		};

		return {
			type: "text/html",
			content: message
		};
	}

	let fileType = path.split(".");
	fileType = "." + fileType[fileType.length- 1]

	let content_type = TYPES[fileType]
	let fileContent = fs.readFileSync(path);

	return {
		type: content_type,
		content: fileContent
	};

}