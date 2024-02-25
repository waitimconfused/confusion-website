import aside from "/components/generate/aside.js";
import footer from "/components/generate/footer.js";

export default new class {
	stylesheet = null;
	header = null;
	headerContent = {};

	content = null;

	aside = null;
	main = null;

	new(){
		document.body.innerHTML = "";

		if(this.stylesheet) this.stylesheet.remove();

		this.stylesheet = document.createElement("link");
		this.stylesheet.rel = "stylesheet";
		this.stylesheet.href = "../../../styles/index.css";
		document.head.appendChild(this.stylesheet);

		let meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "width = device-width, initial-scale = 1.";
		document.head.appendChild(meta);

		this.header = document.createElement("header");
		document.body.appendChild(this.header);

		this.content = document.createElement("content");
		document.body.appendChild(this.content);

		this.aside = document.createElement("aside");
		this.content.appendChild(this.aside);

		this.footer = document.createElement("footer");
		document.body.appendChild(this.footer);
		aside();
		footer();

		this.main = document.createElement("main");
		this.content.appendChild(this.main);
	}

	setHeader(content={icon:"", title:""}){

		this.headerContent = content;

		let div = document.createElement("div");
		div.className = "title";
		this.header.appendChild(div);

		let icon = document.createElement("img");
		icon.src = content.icon;
		div.appendChild(icon);

		let title = document.createElement("h1");
		title.innerText = content.title;
		div.appendChild(title);

		let pageTitle = document.createElement("title");
		pageTitle.innerText = content.title;
		document.head.appendChild(pageTitle);

		let pageIcon = document.createElement("link");
		pageIcon.rel = "icon";
		pageIcon.type = "image/*";
		pageIcon.href = content.icon;
		document.head.appendChild(pageIcon);

		let demoButton = document.createElement("a");
		let projectPath = window.location.href.split("/")[window.location.href.split("/").length - 1];
		demoButton.innerText = "Try It";
		demoButton.style.padding = "calc( var(--padding) / 2 ) calc( var(--padding) )";
		demoButton.href = `/projects/demo/${projectPath}`;
		this.header.appendChild(demoButton);
	}

	addSection(content={title:"", content:""}){
		let section = document.createElement("section");
		this.main.appendChild(section);

		let h1 = document.createElement("h1");
		h1.innerText = content.title;
		section.appendChild(h1);

		let p = document.createElement("p");
		p.innerHTML = content.content.replaceAll("\n", "<br>");
		section.appendChild(p);
	}
}