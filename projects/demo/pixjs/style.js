export class Stylesheet {
	rules = [];
	addRule(regex=new RegExp, replacement=""){
		let rule = { regex, replacement };
		this.rules.push(rule);
	}
}

export function stylize(str="", stylesheet=new Stylesheet){
	let lines = str.split("\n");
	lines.forEach((string, lineNumber) => {
		stylesheet.rules.forEach((rule) => {
			string = string.replaceAll(rule.regex, rule.replacement);
		});
		lines[lineNumber] = string;
	});
	return lines.join("\n");
}

export function stylizeJavascript(str){
	var styled = str.match(/(<=|>=|==|"[\w ]*"|'\w*'|`\w*`|~+|`+|!+|\d+|@+|#+|\$+|%+|\^+|&+|\*+|[\(\)\[\]\{\}]+|-+|_+|=+|\+|\t+|\w+|\|+|\\+|:+|;+|"+|'+|\n|<+|,+|>+|\.+|\?+|\/+| +)/g);
	styled.forEach((token, index) => {
		if(token == "\n") return;
		if(token == "\t") return;
		if(token == " ") return;
		let type = "";

		if(token == "function") type = "mem-declare";
		if(token == "export") type = "export";
		if(/".*"/g.test(token)) type = "string";
		if(/^\/\//g.test(token)) type = "comment";
		if(/[\(\)\[\]\{\}]+/g.test(token)) type = "bracket";
		if(/[\(]+/g.test(styled[index+1])) type = "mem";
		if(styled[index+1] == " "){
			if(/[\(]+/g.test(styled[index+2])) type = "mem";
		}else{
			if(/[\(]+/g.test(styled[index+1])) type = "mem";
		}
		if(/^(var|let|const)$/g.test(token)) type = "mem-declare";
		if(/(===|==|>=|<=|!==|!===|=)/g.test(token)) type = "operator";

		type = type?` class="${type}"`:"";

		token = `<span${type}>${token}</span>`;
		styled[index] = token;
	});
	styled = styled.join("");
	return styled;
}
export function stylizePIXJS(str){
	var styled = str.match(/(<=|>=|==|"[\w ]*"|'\w*'|`\w*`|~+|`+|!+|\d+|@+|#+|\$+|%+|\^+|&+|\*+|[\(\)\[\]\{\}]+|-+|_+|=+|\+|\t+|\w+|\|+|\\+|:+|;+|"+|'+|\n|<+|,+|>+|\.+|\?+|\/+| +)/g);
	styled.forEach((token, index) => {
		if(token == "\n") return;
		if(token == "\t") return;
		if(token == " ") return;
		let type = "";

		if(token == "def") type = "mem-declare";
		if(/".*"/g.test(token)) type = "string";
		if(/^\/\//g.test(token)) type = "comment";
		if(/[\(\)\[\]\{\}]+/g.test(token)) type = "bracket";
		if(/[\(]+/g.test(styled[index+1])) type = "mem";
		if(styled[index+1] == " "){
			if(/[\(]+/g.test(styled[index+2])) type = "mem";
		}else{
			if(/[\(]+/g.test(styled[index+1])) type = "mem";
		}
		if(/(===|==|>=|<=|!==|!===|=)/g.test(token)) type = "operator";

		type = type?` class="${type}"`:"";

		token = `<span${type}>${token}</span>`;
		styled[index] = token;
	});
	styled = styled.join("");
	return styled;
}