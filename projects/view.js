export default function viewProject(project=""){

	let root = window.location.protocol + "//" + window.location.host + "/";
	let isHomePage = window.location.href == root;
	if(project == "confusion" && !isHomePage){
		window.location.href = "/";
	}

	let tempTitle = project
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());

	document.title = tempTitle;
	document.getElementById("title").innerText = tempTitle;
	
	// let response = await fetch(`/projects/markdown/${project}.md`);

	fetch(`/projects/markdown/${project}.md`).then((response) => {
		if(response.status !== 200) return response.status;
		return response.text();
	}).then((markdown) => {
		if(typeof markdown == "number") return;	
		let h1 = markdown.split(/^# {0,}(.*)/gm)[1];

		document.title = h1;
		if(window.location.pathname !== "/"){
			document.title += " | Confusion";
		}
		document.getElementById("title").innerText = h1;

		let sections = markdown
			.replace(/^# {0,}(.*)/g, "")
			.replace(/^(\s*)/g, "")
			.replace(/\*\*([\S\s]+?)\*\*/g, "<strong>$1</strong>")
			.replace(/_([\S\s]+?)_/g, "<strong>$1</strong>")
			.replace(/\*([\S\s]+?)\*/g, "<i>$1</i>");
		sections = sections.split(/^## /gm);

		makeContent(sections);
	});

	if(project == "confusion") return;

	let demoButton = document.createElement("a");
	demoButton.innerText = "Try It";
	demoButton.style.padding = "calc( var(--padding) / 2 ) calc( var(--padding) )";
	demoButton.href = `/projects/demo?project=${project}`;
	document.querySelector("header").appendChild(demoButton);
}

function makeContent(sections=[]){
	if(sections.length == 0) return;
	makeSection(sections[0]);
	sections.shift();
	makeContent(sections);
}

function markdownToHTML(markdownText="") {
    // Dynamic import
	console.log(showdown);

	let converter = new showdown.Converter();
	let html = converter.makeHtml(markdownText);

	console.log(html);
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