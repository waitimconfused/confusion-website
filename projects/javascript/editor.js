const fontawesome_fileExtensions = {
	".js": "fa-brands fa-js",
	".html": "fa-solid fa-code",
	".txt": "fa-solid fa-align-left",
	".md": "fa-brands fa-markdown",
	"readme": "fa-solid fa-circle-info"
}

const codeMirrorLanguages = {
	".js": "javascript",
	".md": "markdown",
	".html": "xml"
}

class Editor {
	element = document.createElement("div");
	tabs = document.createElement("div");
	sidebar = document.createElement("div");
	fileContent = CodeMirror();

	fileElements = {};
	fileContents = {};

	#viewingFile = "";

	constructor(){
		this.element.classList.add("codespace");
		this.tabs.classList.add("tabs");
		this.sidebar.classList.add("sidebar");
		this.element.appendChild(this.sidebar);
		this.element.appendChild(this.tabs);
		
		this.fileContent = CodeMirror(this.element, {
			value: "function oneHundered(){ return 100; }\n\nconsole.log( oneHundered() );\n// 100",
			mode:  "javascript",
			lineNumbers: true,
			theme: "material-darker"
		});

		this.type = "code-editor";
		document.addEventListener("keydown", (e) => {
			if(e.ctrlKey && e.key.toLowerCase() == "s"){
				e.preventDefault();
				this.saveFile(this.#viewingFile, this.fileContent.getValue());
			}else if(e.ctrlKey && e.key.toLowerCase() == "u"){

			}
		});
	}
	newFile(fileName="", content="", sidebar=false){
		let fileElement = document.createElement("div");
		this[!sidebar?"tabs":"sidebar"].appendChild(fileElement);
		let iconElement = this.fontawesome_fileIcon(fileName);
		fileElement.appendChild(iconElement);
		let fileNameElement = document.createElement("span");
		fileNameElement.innerText = fileName;
		fileElement.appendChild(fileNameElement);
		fileElement.onclick = () => {
			this.showFile(fileName, sidebar);
		}
		this.saveFile(fileName, content);
		if(!sidebar){

			let closeButton = document.createElement("i");
			closeButton.className = "fa-solid fa-xmark";
			fileElement.appendChild(closeButton);
			closeButton.onclick = () => {
				this.closeFile(fileName);
			}

			this.newFile(fileName, content, true);
			this.fileElements[fileName] = fileElement;
			this.fileContents[fileName] = content;
			this.showFile(fileName);
		}
	}
	showFile(selectedFileName="", forceOpen=false){
		if(!Object.keys(this.fileContents).includes(selectedFileName)){
			if(forceOpen) this.newFile(selectedFileName, "ERROR: no file content found.");
			return;
		}
		for(let i = 0; i < Object.keys(this.fileElements).length; i++){
			let fileName = Object.keys(this.fileElements)[i];
			let fileButtonElement = this.fileElements[fileName];
			if(fileName == selectedFileName){
				fileButtonElement.classList.add("selected");
			}else{
				fileButtonElement.classList.remove("selected");
			}
		}
		let fileExtension = selectedFileName.match(/\.(\w+)$/gm)[0];
		console.log( codeMirrorLanguages[fileExtension] );
		this.fileContent.setOption("mode", codeMirrorLanguages[fileExtension]);
		if(this.#viewingFile) {
			let fileName = this.#viewingFile;
			let fileContent = this.fileContent.getValue();
			this.fileContents[fileName] = fileContent;
		}
		this.fileContent.setValue(this.fileContents[selectedFileName]);
		this.fileContent.refresh();
		this.#viewingFile = selectedFileName;
	}
	closeFile(fileName=""){
		let indexOfFile = Object.keys(this.fileElements).indexOf(fileName);
		this.fileElements[fileName].remove();
		delete this.fileElements[fileName];
		delete this.fileContents[fileName];
		this.showFile(Object.keys(this.fileElements)[indexOfFile]);
	}
	saveFile(fileName="", fileContent=""){
		localStorage.setItem(fileName, btoa(fileContent));
	}

	fontawesome_fileIcon(fileName=""){
		let fileExtension = fileName.match(/\.(\w+)$/gm)[0];
		let className = fontawesome_fileExtensions[fileExtension] || fontawesome_fileExtensions[".txt"];

		if(fileName.match(/\breadme$|\breadme\.md/gim)) className = fontawesome_fileExtensions["readme"];

		let element = document.createElement("i");
		element.className = className;
		return element;
	}
}

const urlParams = new URLSearchParams(window.location.search);
const isDemo = typeof urlParams.get("demo") == "string";

if(isDemo == false){
	const codeEditor = new Editor();
	document.body.appendChild(codeEditor.element);
	
	if(localStorage.length > 0){
		let fileNames = Object.keys(localStorage);
		for(let i = 0; i < fileNames.length; i ++) {
			let fileName = fileNames[i];
			let fileContentEncrypted = localStorage.getItem(fileName);
			let fileContent = atob(fileContentEncrypted);
			codeEditor.newFile(fileName, fileContent);
	
		}
	}else{
		codeEditor.newFile("index.html", "<h1>Hello World!</h1>\n<script src=\"./index.js\"></script>");
		codeEditor.newFile("index.js", "const my_var = \"Hello World!\";\nconsole.log(my_var);");
		codeEditor.newFile("readme.md", "# Hello World!\n");
	}
}else{
	let indexHTML = atob( localStorage.getItem("index.html") );
	indexHTML = indexHTML.replace(/<script(.*?)><\/script>/gm, "SCRIPT $1")
	// document.innerHTML = indexHTML;
	let iframe = document.createElement("iframe");
	iframe.style.position = "fixed";
	iframe.style.top = "0px";
	iframe.style.left = "0px";
	iframe.style.width = "100vw";
	iframe.style.height = "100vh";
	iframe.style.border = "none";
	document.body.appendChild(iframe);
	iframe.contentDocument.open();
	iframe.contentDocument.write(indexHTML);
	iframe.contentDocument.close();
}