export function upload(input = new HTMLInputElement){
	if (input.files && input.files[0]){
		console.log("Uploaded File");
		var reader = new FileReader();
		reader.onload = function (e) {
			console.log("Read file contents");
			let python = e.target.result;
			document.body.innerText = py_to_js(python);
		};
		reader.readAsText(input.files[0]);
	}
}

function isBlankString(str=""){
	return str.trim() == "";
}

export default function py_to_js(python=""){
	var imports = {};
	var replacements = [];

	// let div = document.createElement("div");
	// document.body.appendChild(div);

	python = python.replaceAll("    ", "\t");
	python = python.replaceAll("\r", "");

	// div.innerText = python;
	// python = div.innerText;
	// div.remove();

	var nestedLevel = 0;
	var pythonLines = python.split("\n");
	// pythonLines = pythonLines.filter(str => !isBlankString(str));
	var variableScope = [
		[]
	];
	pythonLines.forEach((line, index) => {

		if(line.trim().startsWith("#")){
			line = line.replace(/#( *)(.*)$/, "//$1$2");
			pythonLines[index] = line;
			return;
		}

		let indents = line.split(/^(\t*| *)/g)[1]?.split("")?.length || Math.max(nestedLevel - 1, 0);
		let nextLine = index+1;
		while(isBlankString(pythonLines[nextLine])){
			if(nextLine > pythonLines.length - 1) break;
			nextLine += 1;
		}
		let indents_nextLine = pythonLines[nextLine]?.split(/^(\t*| *)/g)[1]?.split("")?.length || Math.max(nestedLevel - 1, 0);
		if(indents > nestedLevel) {
			nestedLevel += Math.abs(nestedLevel - indents);
	
			let lastLine = index - 1;
			while( (/^(\s+)$/).test(pythonLines[lastLine]) ) lastLine -= 1;
			pythonLines[lastLine] += " {";
			variableScope.push([]);
		}else if(indents < nestedLevel && indents_nextLine < nestedLevel) {
			nestedLevel -= Math.abs(nestedLevel - indents);

			let lastLine = index - 1;
			while( (/^(\s+)$/).test(pythonLines[lastLine]) ) lastLine -= 1;
	
			pythonLines[lastLine] += "\n";
			for(let i = 0; i < nestedLevel; i++){
			pythonLines[lastLine] += "\t";
			}
			pythonLines[lastLine] += "}";
			variableScope.pop();
		}

		let variableDeclarationRegex = /(^|[^.])\b(\S*)\b *= */g
		if(variableDeclarationRegex.test(line)){
			let variableName = line.split(variableDeclarationRegex)[2];
			let variableHasBeenDeclared = false
			variableScope.forEach((variables) => {
				if(variables.includes(variableName)) variableHasBeenDeclared = true
			});
			if(!variableHasBeenDeclared){
				variableScope[indents].push(variableName);
				if(indents == 0){
					line = line.replace(/(^|[^.])\b(\S*)\b *= */, "$1export var $2 = ");
				}else{
					
					line = line.replace(/(^|[^.])\b(\S*)\b *= */, "$1let $2 = ");
				}
			}
		}

		let importRegex_one = /from (\S*) import ([\S ]*)/;
		let importRegex_all = /import (\S*)/;
		let builtinRegex = /import (math)/;
		if(builtinRegex.test(line)){
			let importParts = line.split(builtinRegex);
			let libName = importParts[1];
			replacements.push(libName);
			line = "";
		}else if(importRegex_one.test(line)){
			let importParts = line.split(importRegex_one);
			let moduleName = importParts[2];
			let path = importParts[1];
			if(!imports[path]) imports[path] = [];
			imports[path].push(moduleName);
			imports[path].sort();
			variableScope[0].push(moduleName);
			line = "";
		}else if( importRegex_all.test(line) ){
			let importParts = line.split(importRegex_all);
			let path = importParts[1];
			let moduleName = importParts[2];
			if(!imports[path]) imports[path] = "*";
			variableScope[0].push(moduleName);
			line = "";
		}

		line = line.replace(/def {1,}([a-zA-Z\_]{1,}) {0,}\((.*)+?\):/g, "export function $1($2)");
		line = line.replace(/class {1,}(\S*):/g, "class $1");
		line = line.replace(/if *\(([\S\s]+?)\):|if *([\S\s]+?):/, "if($1)");
		line = line.replace(/\bFalse\b/, "false");
		line = line.replace(/\bTrue\b/, "true");
		line = line.replace(/#( *)(.*)$/, "//$1$2");
	
		pythonLines[index] = line;
	});

	Object.keys(imports).reverse().forEach((path) => {
		let modules = imports[path];
		let importString = "";
		if(modules == "*"){
			importString = `import * as ${path} from "./${path}.js"`;
		}else{
			importString = `import { ${ modules.join(", ") } } from "./${path}.js"`;
		}
		pythonLines.unshift(importString);
	});

	pythonLines = pythonLines.join("\n");
	while(nestedLevel > 0) {
		pythonLines += "\n" + "\t".repeat(nestedLevel-1) + "}";
		nestedLevel -= 1;
	}
	pythonLines = pythonLines.split("\n");
	// pythonLines = pythonLines.filter(str => !isBlankString(str));

	let javascript = pythonLines.join("\n");
	javascript = javascript.replaceAll("\nfunction", "\n\nfunction");

	javascript = javascript
	.replaceAll(/(^|[^.])\babs\b/g, "$1Math.abs")
	.replaceAll(/(^|[^.])\bmin\b/g, "$1Math.min")
	.replaceAll(/(^|[^.])\bmax\b/g, "$1Math.max")

	if(replacements.includes("math")){
		javascript = javascript
		.replaceAll(/(^|[^.])\bmath\b/g, "$1Math")
		.replaceAll(/(^|[^.])\bround\b/g, "$1Math.round");
	}

	return javascript;
}