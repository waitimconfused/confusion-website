function getRegexGroups(regex=new RegExp(), string=""){
	return [...string.matchAll(regex)];
}

export var fileOptions = {

	".md": {
		colour: "#2965F1", text: "md",
		links: [ /\[.*\]\((.*)\)/gm ],
		linkPathIndex: 0
	},
	".js": {
		colour: "#F1E05A", text: "JS",
		links: [
			/import [\*{ \w ,}]* from "([.\/\w]*)"/gm,
			/export [\*{ \w ,}]* from "([.\/\w]*)"/gm,
			/require\("([.\/\w]*)"\)/gm,
		],
		linkPathIndex: 0
	},
	".py": {
		colour: "#3572A5", text: "py",
		links: [
			/^ {0,}import (\w*)/gm,
			/^ {0,}from ([\w\W]*) import ([\w\W]*)/gm
		],
		linkPathIndex: 0
	},
	".plugin": {
		colour: "grey", text: "PIX",
		links: [
			/\s*@include (\w+) as \w+ from ([\S]+)/g,
			/\s*@include (\w+) from ([\S]+)/g
		],
		linkPathIndex: 1
	},

	".html": {
		colour: "#E34C26", text: "</>",
		links: [ /<.*src="([\w \.\/\:\;\,\+\-]*)".*>/gm, /<.*href="([\w \.\/\:\;\,\+\-]*)".*>/gm ],
		linkPathIndex: 0
	},
	".css": {
		colour: "#563D7C", text: "CSS",
		links: [ /@import \w*\({0,}"([\w.:\/]*)"\){0,}/gm ],
		linkPathIndex: 0
	},

	".json": {
		colour: "darkgrey", text: "{json}"
	},
	".txt": {
		colour: "grey", text: "TXT"
	},


	".png": {
		colour: "darkgrey", text: "🖼️"
	},
	".svg": {
		colour: "darkgrey", text: "🖼️"
	},
	".jpg": {
		colour: "darkgrey", text: "🖼️"
	},
	".jpeg": {
		colour: "darkgrey", text: "🖼️"
	},
	".webp": {
		colour: "darkgrey", text: "🖼️"
	},
	".gif": {
		colour: "darkgrey", text: "🖼️"
	}
}

export function getFileOptions(fileName=""){
	let fileExtensions = Object.keys(fileOptions);

	let fileExtensionsRegex = new RegExp(`(${fileExtensions.join("|")})$`, "g");

	let fileExtension = getRegexGroups(fileExtensionsRegex, fileName)[0];
	if(fileExtension) fileExtension = fileExtension[0]
	else fileExtension = ".html"

	return {
		data: fileOptions[fileExtension],
		extension: fileExtension
	}
}