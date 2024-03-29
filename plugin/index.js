import plugins from "/plugins/index.json" with {type: "json"};
import PYtoJS from "./convert.js";

document.body.innerHTML = "";

plugins.gameplay.forEach(loadPlugin);
Object.values(plugins.blocks).forEach(loadPlugin);

async function loadPlugin(pluginName=""){
	let response = await fetch(`/plugins/${pluginName}`);
	if(response.status !== 200) {
		return;
	}
	let python = await response.text();

	let javascript = PYtoJS(python);
	document.body.innerText += javascript + "\n\n\n";

	fetch("/api/plugin/save", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: pluginName,
			content: javascript
		})
	})
	.then((response) => response.json())
	.then((json) => {
		if(json.status == 200){
			console.log("Saved plugin: "+pluginName);
		}else{
			console.log("Couldn't save plugin: "+pluginName);
		}
		console.log(json);
	});
}