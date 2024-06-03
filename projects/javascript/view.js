function getMarkdown(project="", markdownPath=""){
	if(!markdownPath) markdownPath = `https://dev-384.github.io/confusion-projects/${project}/readme.md`;

	if(markdownPath.endsWith("undefined")) return "";
	console.log(markdownPath);
	fetch(markdownPath).then((response) => {
		console.log("Status:", response.status);
		if(response.status == 404){
			let iframe = document.createElement("iframe");
			document.documentElement.innerHTML = "";
			iframe.src = "/404";
			iframe.style.display = "none";
			iframe.onload = () => {
				console.dir(iframe);
				document.documentElement.innerHTML = iframe.contentDocument.documentElement.innerHTML;
			}
			document.body.appendChild(iframe);
			return response.status;
		};
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
		makeContent(sections);

		return markdown;
	}).catch(() => {
		markdownPath = markdownPath.replace(/README$/, "undefined");
		markdownPath = markdownPath.replace(/README\.md$/, "README");
		markdownPath = markdownPath.replace(/readme$/, "README.md");
		markdownPath = markdownPath.replace(/readme\.md$/, "readme");
		return getMarkdown(project, markdownPath);
	});
}

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
	
	let markdownPath = `https://raw.githubusercontent.com/Dev-384/confusion-projects/main/${project}/readme.md`;
	if(project == "confusion") markdownPath = "/README.md";

	return getMarkdown(project, "");
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

function makeContent(content=""){
	if(!content) return;
	let html = markdownToHTML(content);
	html = html.replaceAll(/(<h2[\S ]*>[\s\S]+?)(?=<h2|$)/g, "<section>$1</section>");
	document.getElementById("content").innerHTML += html;
	document.querySelectorAll("section h2[id]").forEach((h2) => {
		h2.onclick = () => {
			window.location.href = "#"+h2.id;
		}
	})
}

function markdownToHTML(markdownText="") {
	let converter = new showdown.Converter();
	let html = converter.makeHtml(markdownText);
	return html;
}