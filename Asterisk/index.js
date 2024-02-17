export * as serverside from "./serverside/index.js";
export * as files from "./files/index.js";
export * as message from "./messages/index.js";
export var generateLogs = false;

export function clearLogs(){
	console.clear();
}

export function showLogs(){
	generateLogs = true;
}

export function hideLogs(){
	generateLogs = false;
}