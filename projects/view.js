export default function viewProject(project="", forceLoad=false){

	let root = window.location.protocol + "//" + window.location.host + "/";
	let isHomePage = window.location.href == root;
	if(project == "confusion" && !isHomePage && !forceLoad){
		window.location.href = "/";
	}

	let tempTitle = project
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());

	document.title = tempTitle;
	document.getElementById("title").innerText = tempTitle;
	
	let markdownPath = `/projects/markdown/${project}.md`;
	if(project == "confusion") markdownPath = "/README.md";

	fetch(markdownPath).then((response) => {
		if(response.status !== 200) return response.status;
		return response.text();
	}).then((markdown) => {
		if(typeof markdown == "number") return;
		options(markdown, project);
		markdown = markdown.replace(/(\.\.\.[\S\s]+?\.\.\.\n*)/, "");
		let h1 = markdown.split(/^# {0,}(.*)/gm)[1];

		document.title = h1;
		if(window.location.pathname !== "/"){
			document.title += " | Confusion";
		}
		document.getElementById("title").innerText = h1;

		let sections = markdown.replace(/^# {0,}(.*)/m, "");
		mkContent(sections);
		sections = sections.split(/^## /gm);

		// makeContent(sections);

		return markdown;
	});
}

function options(markdown="", project=""){
	let optionsObject = {};
	if(markdown.startsWith("\.\.\.")){
		let options = markdown.split("\.\.\.")[1].split(/(\S+?): *([\S ]*)/g);
		for(let index = 0; index < options.length - 1; index += 3){
			let option = [options[index+1], options[index+2]];
			let key = option[0];
			let value = option[1];
			optionsObject[key] = value;
		}
	}
	if(typeof optionsObject.link !== "undefined" && optionsObject.link !== "none"){
		let link = optionsObject.link.split(/\[([\S ]*)\]\(([\S ]*)\)/);
		let href = link[2];
		let demoButton = document.createElement("a");
		demoButton.innerText = link[1];
		demoButton.style.padding = "calc( var(--padding) / 2 ) calc( var(--padding) )";
		demoButton.href = href;
		if(!(/^\.\/|^\//gm).test(href)){
			demoButton.target = "_blank";
		}
		document.querySelector("header").appendChild(demoButton);
	}else if(optionsObject.link !== "none"){
		let demoButton = document.createElement("a");
		demoButton.innerText = "Try It";
		demoButton.style.padding = "calc( var(--padding) / 2 ) calc( var(--padding) )";
		demoButton.href = `/projects/demo?project=${project}`;
		document.querySelector("header").appendChild(demoButton);
	}
}

function makeContent(sections=[]){
	if(sections.length == 0) return;
	makeSection(sections[0]);
	sections.shift();
	makeContent(sections);
}

function mkContent(content=""){
	if(!content) return;
	console.log(content);
	let html = markdownToHTML(content);
	html = html.replaceAll(/(<h2[\S ]*>[\s\S]+?)(?=<h2|$)/g, "<section>$1</section>");
	document.getElementById("content").innerHTML += html;
	console.log(html);
}

function markdownToHTML(markdownText="") {
	let converter = new showdown.Converter();
	let html = converter.makeHtml(markdownText);
	return html;
}

function makeSection(content=""){
	content = content.replace(/^(\s*)/g, "");
	if(!content) return;

	let h2 = content.split(/^([\S ]*)/g)[1];
	h2 = h2.replace(/^(\s*)/g, "");
	let p = content.split(/^([\S ]*)/g)[2];
	p = markdownToHTML(p);
	// p = p.replaceAll("\n", "");
	// p = p.replaceAll("\r", "");

	let section = document.createElement("section");
	document.getElementById("content").appendChild(section);
	let h2Element = document.createElement("h2");
	h2Element.innerText = h2;
	section.appendChild(h2Element);
	let pElement = document.createElement("p");
	pElement.innerHTML = p.replace("\n", "");
	section.appendChild(pElement);
}