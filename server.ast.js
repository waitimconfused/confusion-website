import * as Ast from "./Asterisk/index.js";
import fs from "node:fs";

Ast.clearLogs();

let port = `${Math.floor(Math.random() * 9999)}`;
while(port.length < 4) port += "0";
port = JSON.parse(port);

Ast.serverside.open(port);