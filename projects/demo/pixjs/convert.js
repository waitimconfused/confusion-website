export default function(input=""){
	let str = `${input}`;
	str = str.replaceAll("  ", "\t");
	str = str.replaceAll("\n\n\t", "\n\t");
	str = str.replaceAll(/(\s*)$/g, "");

	while(str.endsWith("\n") || str.endsWith("\t")){
		while(str.endsWith("\n")) str = str.slice(0, -1); 
		while(str.endsWith("\t")) str = str.slice(0, -1);
	}

	while(str.includes("\n\n")){
		str = str.replaceAll("\n\n", "\n");
	}
	while(str.startsWith("\n") || str.startsWith("\t")){
		while(str.startsWith("\n")) str = str.replace("\n", "")
		while(str.startsWith("\t")) str = str.replace("\t", "")
	}

	str += "\n";
	
	str = str.split("\n");
	
	let nestedLevel = 0;
	str.forEach((line, lineNumber) => {
	  line = line.replaceAll(/# {0,}(.*)$/g, "// $1");
	  line = line.replaceAll(/if (.*)/g, "if ($1)");
	  line = line.replaceAll(/^(\t?)([a-zA-Z]*):([a-zA-Z]*)/gm, "$1$2.get(\"$3\")");
	  line = line.replaceAll(/=( ?)([a-zA-Z]+):([a-zA-Z]+)/gm, "=$1$2.get(\"$3\")");
	  line = line.replaceAll(/([a-zA-Z\.]*) has ([a-zA-Z\."]*)/g, "$1.includes($2)");
	  line = line.replaceAll(/def {1,}([a-zA-Z\_]{1,}) {0,}\((.*){0,}\)/g, "export function $1($2)");
	  line = line.replaceAll(/def {1,}async {1,}([a-zA-Z\_]{1,}) {0,}\((.*){0,}\)/g, "export async function $1($2)");
	  line = line.replaceAll(/def {1,}(\w+) {0,}= {0,} (.+)/g, "var $1 = $2");
	  line = line.replaceAll(/def {1,}\{ {0,}(\w+)  {0,}\} {0,}= {0,} (.+)/g, "var { $1 } = $2");
	  line = line.replaceAll(/import {1,}([\w, {}]*) {1,}from {0,}runtime/g, "const { $1 } = await get(\"./runtime.js\")");
	  line = line.replaceAll(/import {1,}(\w*) {1,}from {0,}([\w\.\/]*)/g, "import { $1 } from \"$2\"");
	  line = line.replaceAll(/def {1,}(\w+)/g, "var $1 = {};");
	  line = line.replaceAll(/alert\((.*)\)/g, "game.log($1)");
	
	
	  let indents = line.split(/^(\t*| *)/g)[1]?.split("")?.length || Math.max(nestedLevel - 1, 0);
	  if(indents > nestedLevel) {
		nestedLevel += Math.abs(nestedLevel - indents);
	
		str[lineNumber-1] += " {";
	  }else if(indents < nestedLevel) {
		nestedLevel -= Math.abs(nestedLevel - indents);
	
		str[lineNumber-1] += "\n";
		for(let i = 0; i < nestedLevel; i++){
		  str[lineNumber-1] += "\t";
		}
		str[lineNumber-1] += "\}";
	  }
	
	  str[lineNumber] = line;
	});
	
	str = str.join("\n");
	str = str.split("\n");
	
	str.forEach((line, index) => {
	  if(
		line.endsWith("{") == false &&
		line.endsWith("}") == false &&
		line.endsWith(";") == false &&
		line !== ""
	  ) line += ";";
	  str[index] = line;
	})
	
	str = str.join("\n");

	return str;
}