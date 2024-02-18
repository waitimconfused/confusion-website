import * as Ast from "./Asterisk/index.js";

Ast.clearLogs();

let port = `${12}`;
while(port.length < 4) port += "0";
port = JSON.parse(port);

Ast.serverside.open(port);