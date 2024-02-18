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
		// <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

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
		function makeHttpObject() {
			try {return new XMLHttpRequest();}
			catch (error) {}
			try {return new ActiveXObject("Msxml2.XMLHTTP");}
			catch (error) {}
			try {return new ActiveXObject("Microsoft.XMLHTTP");}
			catch (error) {}
		
			throw new Error("Could not create HTTP request object.");
		}
		
		var request = makeHttpObject();
		request.open("GET", "/index.html", true);
		request.send(null);
		request.onreadystatechange = function() {
			if (request.readyState == 4){
				let html = request.responseText;
		
				let iframe = document.createElement("iframe");
				iframe.style.display = "none";
				document.body.appendChild(iframe);
		
				let iframeDocument = iframe.contentWindow.document;
		
				iframeDocument.body.innerHTML = html;
		
				let iframeAside = iframeDocument.getElementsByTagName("aside")[0];
		
				document.getElementsByTagName("aside")[0].innerHTML = iframeAside.innerHTML;
		
				iframe.remove();
			}
		}
	}

	reloadFooter(){
		while(document.getElementsByTagName("footer")[0]){
			document.getElementsByTagName("footer")[0]?.remove();
		}
		let footer = document.createElement("footer");
		this.main.appendChild(footer);

		let icon = document.createElement("img");
		icon.src = this.headerContent.icon;
		footer.appendChild(icon);

		let title = document.createElement("h1");
		title.innerText = this.headerContent.title;
		footer.appendChild(title);
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

		this.reloadFooter();
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

		this.reloadFooter();
	}
}