import packageJSON from "../../package.json" assert {type: "json"};

document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

let asideData = packageJSON.index.asideContent;

const asideElement = document.getElementsByTagName("aside")[0];
asideElement.innerHTML = "";
const mainElement = document.getElementsByTagName("main")[0];

Object.keys(asideData).forEach(header => {
	console.log(header);
	let children = asideData[header];

	let sectionDiv = document.createElement("section");
	asideElement.appendChild(sectionDiv);

	let sectionHeader = document.createElement("h1");
	sectionHeader.innerText = header;
	sectionDiv.appendChild(sectionHeader);

	let childrenDiv = document.createElement("div");
	sectionDiv.appendChild(childrenDiv);


	children.forEach((element) => {
		if(element.type == "text") text(element, childrenDiv);
		if(element.type == "link") link(element, childrenDiv);
		if(element.type == "image") image(element, childrenDiv);
	});
});

function text(element, parentDiv){
	let childDiv = document.createElement("div");
	parentDiv.appendChild(childDiv);

	let child = document.createElement("p");
	child.innerText = element.text;
	childDiv.appendChild(child);
}

function link(element, parentDiv){
	// let childDiv = document.createElement("div");
	// parentDiv.appendChild(childDiv);

	let child = document.createElement("a");
	child.innerText = element.text;
	child.href = element.href;
	parentDiv.appendChild(child);
}

function image(element, parentDiv){
	let childDiv = document.createElement("div");
	parentDiv.appendChild(childDiv);

	let child = document.createElement("img");
	child.src = element.src;
	childDiv.appendChild(child);
}