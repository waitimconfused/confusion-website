const Ast = require("asterisk-server");

Ast.clearLogs();
Ast.serverside.open(1200);
Ast.files.regester404("./404.html");
Ast.api.lock();