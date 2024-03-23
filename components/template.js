let templateElements = document.querySelectorAll("template");

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

function stringify(element) {
	let obj = {};
	obj.name = element.localName;
	obj.attributes = [];
	obj.children = [];
	Array.from(element.attributes).forEach(a => {
		obj.attributes.push({ name: a.name, value: a.value });
	});
	Array.from(element.children).forEach(c => {
		obj.children.push(stringify(c));
	});

	return obj;
}