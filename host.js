const Ast = require("asterisk-server");

console.clear();
Ast.server.open(1200);
Ast.files.registerStatusPage(404, "./404.html");
Ast.api.lockIP();