export default new class {
	stylesheet = null;
	header = null;

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

		this.header = document.createElement("header");
		document.body.appendChild(this.header);

		this.content = document.createElement("content");
		document.body.appendChild(this.content);

		this.aside = document.createElement("aside");
		this.content.appendChild(this.aside);
		this.reloadAside();

		this.main = document.createElement("main");
		this.content.appendChild(this.main);

		this.reloadFooter();
	}

	reloadAside(){
		let asideData = {
			"Recent Projects": [
				{type: "link", href:"../../../", text: "Confusion Homepage"},
				{type: "link", href:"/projects/view/faker_banker/", text: "Faker Banker"}
			],
			"Project Showcase": [
				{type: "text", text: "Nothing's Here!"}
			]
		};

		Object.keys(asideData).forEach((sectionName) => {
			let sectionElement = document.createElement("section");
			this.aside.appendChild(sectionElement);

			let headerElement = document.createElement("h1");
			headerElement.innerText = sectionName;
			sectionElement.appendChild(headerElement);

			let contentsElement = document.createElement("div");
			sectionElement.appendChild(contentsElement);

			let sectionContent = asideData[sectionName];
			sectionContent.forEach((contentData) => {
				if(contentData.type == "link"){
					let content = document.createElement("a");
					content.href = contentData.href;
					content.innerText = contentData.text;
					contentsElement.appendChild(content);
				}else if(contentData.type == "text"){
					let content = document.createElement("p");
					content.innerText = contentData.text;
					contentsElement.appendChild(content);
				}
			});
		});
	}

	reloadFooter(){
		let preexistingFooter = document.getElementsByTagName("footer")[0];
		preexistingFooter?.remove();
	}

	setHeader(content={icon:"", title:""}){
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