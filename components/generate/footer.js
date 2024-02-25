import get from "./get.js";

export default async function(){
	let html = await get("/projects.html");
		
	let iframe = document.createElement("iframe");
	iframe.style.display = "none";
	document.body.appendChild(iframe);

	let iframeDocument = iframe.contentWindow.document;

	iframeDocument.body.innerHTML = html;

	let iframeAside = iframeDocument.getElementsByTagName("footer")[0];

	document.getElementsByTagName("footer")[0].innerHTML = iframeAside.innerHTML;

	iframe.remove();	
}