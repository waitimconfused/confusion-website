var db;
const request = indexedDB.open("projectsDB", 1);

request.onsuccess = function (event) {
	db = event.target.result;

	let projectName = getProjectNameFromURL();

	if (projectName) {
		let transaction = db.transaction(["projects"], "readonly");
		let objectStore = transaction.objectStore("projects");
		let index = objectStore.index("projectName");

		let request = index.get(projectName);
		request.onsuccess = function (event) {
			let project = event.target.result;
			console.log(project);
			if (project.type == "code") {
				location.href = `./project/code?p=${projectName}`;
			} else if (project.type == "art") {
				location.href = `./project/studio?p=${projectName}`;
			} else if (project.type == "note") {
				location.href = `./project/note?p=${projectName}`;
			}
		};

		request.onerror = function (event) {
			console.error("Get project error: " + event.target.errorCode);
		};
	}
};

request.onerror = function (event) {
	console.error("Database error: " + event.target.errorCode);
};

function getProjectNameFromURL() {
	let urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('p');
}

function displayFiles() {

	let projectName = getProjectNameFromURL();

	if (projectName) {
		let transaction = db.transaction(["projects"], "readonly");
		let objectStore = transaction.objectStore("projects");
		let index = objectStore.index("projectName");

		let request = index.get(projectName);
		request.onsuccess = function (event) {
			let project = event.target.result;
			if (project.type == "code") {
				console.log()
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
