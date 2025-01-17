var db;
var editor;
const iframe = document.createElement("iframe");
const projectName = ( new URLSearchParams(window.location.search) ).get("p");
document.querySelector("title").innerText = document.querySelector("title").innerText.replace("■■■■■", projectName);

require.config({ paths: { vs: '/library/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
	editor = monaco.editor.create(document.getElementById('code'), {
		value: `<!DOCTYPE html>\n<html>\n\n\t<head>\n\t\t<style>\n\t\t\th1 {\n\t\t\t\tcolor: red;\n\t\t\t}\n\t\t</style>\n\t</head>\n\n\t<body>\n\t\t<h1>Hello World!</h1>\n\t</body>\n\n</html>`,
		language: 'html'
	});
	document.body.appendChild(iframe);
	iframe.contentWindow.document.documentElement.innerHTML = editor.getValue();
	
	editor.getModel().onDidChangeContent((event) => {
		iframe.contentWindow.document.documentElement.innerHTML = editor.getValue();
	});
	  

	let request = indexedDB.open("projectsDB", 1);
	
	request.onsuccess = function (event) {
		db = event.target.result;
		displayFiles();
	};

	request.onerror = function (event) {
		console.error("Database error: " + event.target.errorCode);
	};
});

function displayFiles() {
	let filesList = document.getElementById("filesList");
	filesList.innerHTML = "";

	if (projectName) {
		let transaction = db.transaction(["projects"], "readonly");
		let objectStore = transaction.objectStore("projects");
		let index = objectStore.index("projectName");

		let request = index.get(projectName);
		request.onsuccess = function (event) {
			let project = event.target.result;
			if (project) {
				project.files.forEach(file => {
					let li = document.createElement("li");
					li.textContent = `${file.filePath} - ${file.fileContent}`;
					filesList.appendChild(li);
				});
			} else {
				console.log("Project not found");
			}
		};

		request.onerror = function (event) {
			console.error("Get project error: " + event.target.errorCode);
		};
	}
}

function addFile() {
	let projectName = getProjectNameFromURL();
	let filePathInput = document.getElementById("filePathInput");
	let fileContentInput = document.getElementById("fileContentInput");

	let filePath = filePathInput.value;
	let fileContent = fileContentInput.value;

	if (projectName && filePath && fileContent) {
		let transaction = db.transaction(["projects"], "readwrite");
		let objectStore = transaction.objectStore("projects");
		let index = objectStore.index("projectName");

		let request = index.get(projectName);
		request.onsuccess = function (event) {
			let project = event.target.result;
			if (project) {
				project.files.push({ filePath: filePath, fileContent: fileContent });

				let updateRequest = objectStore.put(project);
				updateRequest.onsuccess = function () {
					console.log("File added to project successfully");
					filePathInput.value = "";
					fileContentInput.value = "";
					displayFiles();
				};

				updateRequest.onerror = function (event) {
					console.error("Add file to project error: " + event.target.errorCode);
				};
			} else {
				console.log("Project not found");
			}
		};

		request.onerror = function (event) {
			console.error("Get project error: " + event.target.errorCode);
		};
	}
}

function removeFileFromProject(projectName, filePath) {
	const transaction = db.transaction(["projects"], "readwrite");
	const objectStore = transaction.objectStore("projects");
	const index = objectStore.index("projectName");

	const request = index.get(projectName);
	request.onsuccess = function (event) {
		const project = event.target.result;
		if (project) {
			project.files = project.files.filter(file => file.filePath !== filePath);

			const updateRequest = objectStore.put(project);
			updateRequest.onsuccess = function () {
				console.log("File removed from project successfully");
				displayFiles();
			};

			updateRequest.onerror = function (event) {
				console.error("Remove file from project error: " + event.target.errorCode);
			};
		} else {
			console.log("Project not found");
		}
	};

	request.onerror = function (event) {
		console.error("Get project error: " + event.target.errorCode);
	};
}
