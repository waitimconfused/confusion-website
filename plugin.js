import plugins from "./plugins/index.json" with {type: "json"};
import * as fs from "node:fs";
import * as path from "node:path";
import PYtoJS from "./plugin/convert.js";

console.clear();

function mkdir(dir=""){
	if(!fs.existsSync(dir)) fs.mkdirSync(dir);
}

function writeFile(file="", content=""){
	let dir = path.dirname(file)
	mkdir(dir);
	fs.writeFileSync(file, content);
}

console.log(plugins)

plugins.gameplay.forEach(loadPlugin);
Object.values(plugins.blocks).forEach(loadPlugin);

async function loadPlugin(pluginName=""){
	console.log(pluginName);
	let pythonBuffer = fs.readFileSync(`./plugins/${pluginName}`);

	let python = pythonBuffer.toString();

	let javascript = PYtoJS(python);

	pluginName = pluginName.replace(/\.[^\/.]+$/, "");

	writeFile(`./plugins/compiled/${pluginName}.js`, javascript);
}