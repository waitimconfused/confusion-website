const root = window.location.protocol+"//"+window.location.host;
export async function sendData(data, endpoint=""){

	while(endpoint.startsWith("/")) endpoint = endpoint.replace("/", "");
	let response = await fetch(root + "/server/" + endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	let json = await response.json();

	return json;
}