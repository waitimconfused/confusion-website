export default async function(url){

	let response = await fetch(url);

	let text = await response.text();

	return text;
}