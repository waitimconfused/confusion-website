reloadTemplateElements();
function reloadTemplateElements(){
	let templateElements = document.querySelectorAll("template[from]");

	templateElements.forEach((replaceMe) => {
		let importPath = replaceMe.getAttribute("from");
		let id = replaceMe.id;

		if(!importPath) return;
		
		let iframe = document.createElement("iframe");
		iframe.src = importPath;
		iframe.style.display = "none";
		document.body.appendChild(iframe);
		
		iframe.onload = () => {
			let template = iframe.contentWindow.document.querySelector(`template#${id}`) || new HTMLTemplateElement;
			template = template.content.cloneNode(true);
			replaceMe.replaceWith(template);
			document.body.removeChild(iframe);
		}
	});
}