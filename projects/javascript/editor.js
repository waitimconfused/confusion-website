console.clear();

const fontawesome_fileExtensions = {
	".js": "fa-brands fa-js",
	".html": "fa-solid fa-code",
	".txt": "fa-solid fa-align-left",
	".md": "fa-brands fa-markdown",
	"readme": "fa-solid fa-circle-info"
}

class Editor {
	element = document.createElement("div");
	tabs = document.createElement("div");
	sidebar = document.createElement("div");
	fileContent = document.createElement("div");

	fileElements = {};
	fileContents = {};

	constructor(){
		this.element.classList.add("codespace");
		this.tabs.classList.add("tabs");
		this.sidebar.classList.add("sidebar");
		this.fileContent.classList.add("file-content");
		this.element.appendChild(this.sidebar);
		this.element.appendChild(this.tabs);
		this.element.appendChild(this.fileContent);
		this.type = "code-editor";
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
		this.fileContent.innerText = this.fileContents[selectedFileName];
	}
	closeFile(fileName=""){
		let indexOfFile = Object.keys(this.fileElements).indexOf(fileName);
		this.fileElements[fileName].remove();
		delete this.fileElements[fileName];
		delete this.fileContents[fileName];
		this.showFile(Object.keys(this.fileElements)[indexOfFile]);
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

const codeEditor = new Editor();
document.body.appendChild(codeEditor.element);

codeEditor.newFile("readme.md", "# Hello World!\n");
codeEditor.newFile("index.html", "<h1>Hello World!</h1><script src=\"./index.js\"></script>");
codeEditor.newFile("index.js", "const my_var = \"Hello World!\";\nalert(my_var);");