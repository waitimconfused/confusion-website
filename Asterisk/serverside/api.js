import * as MESSAGE from "../messages/index.js";

export var endpoints = [];

export var prefix = "";
setPrefix("api");

/**
 * SERVER-SIDE
 * Create an API endpoint
 * 
 * @param { Function } callback This function is given input data, and outputs a JSON object
 * @param { String } name Path to the endpoint
 * 
 * **Example**:
 * ```
 * createEndpoint( function(dataIn){
 *   return {"message": "You sent: " + JSON.stringify(dataIn)};
 * }, "/my_api");
 * ```
 * This creates an endpoint at the path `localhost:<PORT>/api/my_api`, and outputs a JSON object
 */
export function createEndpoint(callback=(data={})=>{return data}, name="/my_api"){
	while( name.startsWith("/") ) name = name.replace("/", "");

	name = `${prefix}${ name }`;

	endpoints.push({
		name: name,
		callback: callback
	});

	MESSAGE.code("api-new", name);
}
/**
 * SERVER-SIDE
 * INTERNAL FUNCTION
 * 
 * An inbetween from client api call to server response
 * Finding the correct api to use, and returning the api's data
*/
export function handleRequest(data, endpoint=""){

	if(!data){
		return {
			type: api.type,
			content: {error: "API endpoint was not passed any data"}
		}
	}

	let api = endpoints.find( (apiEndpoint) => {
		return apiEndpoint.name == endpoint;
	} );

	return {
		type: api.type,
		content: api.callback(data)
	};
}

/**
 * SERVER-SIDE
 * 
 * Set the begining path of the API
 * 
 * Default is "/api/"
 * 
 * @param { string } API path prefix
 * 
 * **Example**:
 * ```js
 * 
 * setPrefix("/foobar/"); // Set API path prefix
 * 
 * createEndpoint( function(dataIn){
 *   return {"message": "You sent: " + JSON.stringify(dataIn)};
 * }, "/my_api"); // Create API endpoint at "localhost:<PORT>/foobar/my_api"
 * 
 * ```
*/
export function setPrefix(string=""){

	while(string.startsWith("/")){
		string = string.replace("/", "")
	}

	while(string.endsWith("/")){
		string = string.split("").reverse().join("").replace("/", "").split("").reverse().join("");
	}

	prefix = "/"+string+"/";

}