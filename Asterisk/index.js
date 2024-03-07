export * as serverside from "./serverside/index.js";
export * as files from "./files/index.js";
export * as message from "./messages/index.js";
export var generateLogs = false;

/**
 * Exactally like `console.log`
*/
export function clearLogs(){
	console.clear();
}
/**
 * SERVER-SIDE
 * 
 * Show all terminal messages/warnings/errors
 * 
 * By default, the terminal will show all messages
*/
export function showLogs(){
	generateLogs = true;
}
/**
 * SERVER-SIDE
 * 
 * Show all terminal messages/logs/warnings/errors
 * 
 * By default, the terminal will show all messages
*/
export function hideLogs(){
	generateLogs = false;
}