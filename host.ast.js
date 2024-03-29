import * as Ast from "./Asterisk/index.js";
import * as fs from "node:fs";
import * as path from "node:path";

Ast.clearLogs();
Ast.serverside.open(1200);

Ast.files.regester404("./404.html");

Ast.serverside.api.lock();

function mkdir(dir=""){
	if(!fs.existsSync(dir)) fs.mkdirSync(dir);
}

function writeFile(file="", content=""){
	let dir = path.dirname(file)
	mkdir(dir);
	fs.writeFileSync(file, content);
}

Ast.serverside.api.createEndpoint(function(dataIn, IP){
	let isThisMachine = Ast.isThisMachine(IP);
	if(!isThisMachine) return { status: 403 };
	let fileName = dataIn.title
	writeFile(`./plugins/compiled/${fileName}.js`, dataIn.content);
	return {status: 200};
}, "/plugin/save");