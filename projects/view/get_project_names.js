export default async function(){
	let response = await fetch('/get_project_names.php');

	let files = await response.json();

	console.log(files);
}