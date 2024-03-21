import * as Ast from "./Asterisk/index.js";

Ast.clearLogs();
Ast.serverside.open(1200);

Ast.files.regester404("./404.html");

Ast.serverside.api.createEndpoint(function(data, IP){

	let currentIP = Ast.getIP();

	let ipIsMachine = (IP == "127.0.0.1");
	let ipIsThisComputer = (IP == currentIP);

	if( (ipIsMachine || ipIsThisComputer) == false ) return {status: 401};

}, "/my_api");