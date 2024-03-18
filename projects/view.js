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
		let h1 = markdown.split(/^# {0,}(.*)/g)[1];

		document.title = h1;
		if(window.location.pathname !== "/"){
			document.title += " | Confusion";
		}
		document.getElementById("title").innerText = h1;

		let sections = markdown.replace(/^# {0,}(.*)/g, "");
		sections = sections.replace(/^(\s*)/g, "");
		sections = sections.split("## ");

		makeContent(sections);
	})

	// console.log(response.status)

	// if(response.status == 404){
	// 	document.body.innerHTML = "<iframe src='/404.html' style='position:fixed;top:0px;left:0px;width:100vw;height:100vh;border:none;outline:none;'></iframe>";
	// 	return;
	// }

	// let markdown = await response.text();

	// let h1 = markdown.split(/^# {0,}(.*)/g)[1];

	// document.title = h1;
	// if(window.location.pathname !== "/"){
	// 	document.title += " | Confusion";
	// }
	// document.getElementById("title").innerText = h1;

	// let sections = markdown.replace(/^# {0,}(.*)/g, "");
	// sections = sections.replace(/^(\s*)/g, "");
	// sections = sections.split("## ");

	// await makeContent(sections);

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

function makeSection(content=""){
	content = content.replace(/^(\s*)/g, "");
	if(!content) return;

	let h2 = content.split(/^([\S ]*)/g)[1];
	h2 = h2.replace(/^(\s*)/g, "");
	let p = content.split(/^([\S ]*)/g)[2];
	p = p.replace(/^(\s*)/g, "");
	p = p.replace(/(\s*)$/g, "");
	p = p.replaceAll("\n", "<br>");

	p = p.replaceAll(/!\[([\S\s]+)\]\(([\S\s]+)\)/g, "<img src='$2' alt='$1'>");
	p = p.replaceAll(/\[([\S\s]+?)\]\(([\S]+?)\)/g, "<a href='$2'>$1</a>");
	p = p.replaceAll(/\[([\S\s]+?)\]\(([\S]+?)\)/g, "<a href='$2'>$1</a>");
	p = p.replaceAll(/```(\w*)\n*([\s\S]+?)\n*```/gm, "<div class='code block' lang='$1'>$2</div>");
	p = p.replaceAll(/`([\s\S]+?)`/g, "<div class='code'>$1</div>");

	let section = document.createElement("section");
	document.getElementById("content").appendChild(section);
	let h2Element = document.createElement("h2");
	h2Element.innerText = h2;
	section.appendChild(h2Element);
	let pElement = document.createElement("p");
	pElement.innerHTML = p;
	section.appendChild(pElement);
}