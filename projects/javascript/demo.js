import projectList from "https://dev-384.github.io/confusion-projects/projects.json" with { type: "json" };


const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
const projectOptions = projectList.find((project) => {
	return project.title == projectName;
});

if(!projectOptions) {
	let iframe = document.createElement("iframe");
	document.documentElement.innerHTML = "";
	iframe.src = "/404";
	iframe.style.display = "none";
	iframe.onload = () => {
		console.dir(iframe);
		document.documentElement.innerHTML = iframe.contentDocument.documentElement.innerHTML;
	}
	document.body.appendChild(iframe);
}

const linkPath = projectOptions.link;

const favicon = document.querySelector("head link[rel=icon]");
const meta_themeColor = document.querySelector("head meta[name=theme-color]");

let src = "/404.html";
if(projectName) src = `https://dev-384.github.io/confusion-projects/${linkPath}`;
if(linkPath.startsWith("https://") || linkPath.startsWith("http://") ) {
	src = linkPath;
}

let iframe = document.createElement("iframe");
iframe.src = src;
iframe.style.position = "fixed";
iframe.style.top = 0;
iframe.style.left = 0;
iframe.style.width = "100vw";
iframe.style.height = "100vh";
iframe.style.border = "none";
iframe.style.outline = "none";

iframe.onload = () => {
	try{
		let iframeDoc = iframe.contentWindow || iframe.contentWindow.document;
		console.log(iframeDoc.body.innerHTML);
		// document.title = iframeDoc.title;

		// let iframeFavicon = iframeDoc.querySelector("head link[rel=icon]");
		// if(iframeFavicon) {
		// 	if(iframeFavicon.href.startsWith("./")) {
		// 		iframeFavicon.href = `${iframe.src}/${iframeFavicon.href}`
		// 	}
		// 	favicon.href = iframeFavicon.href;
		// 	favicon.type = iframeFavicon.type;
		// }

		// let iframeMetaThemeColor = iframeDoc.querySelector("head meta[name=theme-color]");
		// if(iframeMetaThemeColor) {
		// 	meta_themeColor.content = iframeMetaThemeColor.content
		// }

		// iframe.focus();
		// console.groupEnd();
		// console.group("Page: " + iframeDoc.location.pathname);
	} catch (error) {
		console.error("Error accessing iframe content:", error);
	}
}
document.body.prepend(iframe);