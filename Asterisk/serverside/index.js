import * as API from "./api.js";
import * as FILES from "../files/index.js";
import * as MESSAGE from "../messages/index.js";
import http from "node:http";

export var port = 0;

export function open(portNumber = 3000){
	port = portNumber;

	http.createServer(onRequest).listen(portNumber);

	MESSAGE.code("server-open", portNumber);
}

export var onRequest = function(request=http.IncomingMessage, response=http.ServerResponse){

	let isAPI = false;

	let req_url = request.url;

	API.endpoints.forEach( (apiData) => {
		if(apiData.name == req_url) isAPI = true;
	} );

	if(isAPI == true){

		var body = "";
		request.on("readable", function() {
			body += request.read() || "";
		});

		request.on("end", function() {
			body = JSON.parse(body || "{}");
	
			let API_response = API.handleRequest(body, req_url);
			let API_responseString = JSON.stringify(API_response.content || {response: 200});
			response.writeHead(200, { "Content-Type": "plain/text" });
			
			let chunks = API_responseString.match(/.{1,8}/g);

			chunks.forEach((chunk) => {
				response.write(chunk);
			});
			response.end();
		});

	}else{
		let filePath = req_url;
		let file = FILES.get(filePath);
		let fileType = file.type;
		let fileContent = file.content;
		
		if(typeof fileType) response.setHeader("Content-Type", fileType);
		response.end( fileContent );
	}
}

export * as api from "./api.js";
export * as files from "../files/index.js";