const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');

let src = "/404.html";
if(projectName) src = `./demo/${projectName}/`;
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
	let iframeDoc = iframe.contentWindow.document;
	document.title = iframeDoc.title;
	iframe.focus();
	console.groupEnd();
	console.group("Page: " + iframeDoc.location.pathname);
}
document.body.prepend(iframe);