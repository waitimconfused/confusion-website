import packageJSON from "../../package.json" with { type: "json" };
const PORT = packageJSON.port;

const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');

const favicon = document.querySelector("head link[rel=icon]");
const meta_themeColor = document.querySelector("head meta[name=theme-color]");

let src = "/404.html";
if(projectName) src = `https://dev-384.github.io/confusion-projects/${projectName}/`;
// window.location.href = src;

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