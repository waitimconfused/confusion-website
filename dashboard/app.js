var db;
const request = indexedDB.open("projectsDB", 1);

request.onupgradeneeded = function (event) {
	db = event.target.result;
	let objectStore = db.createObjectStore("projects", { keyPath: "id", autoIncrement: true });
	objectStore.createIndex("projectName", "projectName", { unique: true });
};

request.onsuccess = function (event) {
	db = event.target.result;
	displayProjects();
};

request.onerror = function (event) {
	console.error("Database error: " + event.target.errorCode);
};

function displayProjects() {
	let projectsList = document.getElementById("tiles");
	projectsList.innerHTML = "";

	let transaction = db.transaction(["projects"], "readonly");
	let objectStore = transaction.objectStore("projects");

	let card = document.createElement("div");
	card.classList.add("card", "constant");
	card.style.gridArea = "1 / 1 / 2 / 3";
	card.innerHTML = `
		<input type="text" id="projectNameInput" placeholder="Enter project name">
		<select id="projectType">
			<option value="" disabled selected>Select Project Type</option>
			<option value="code">Code</option>
			<option value="note">Note</option>
			<option value="art">Art</option>
		</select>

		</select>
		<button onclick="addProject()">Add Project</button>
	`;
	projectsList.appendChild(card);

	objectStore.openCursor().onsuccess = function (event) {
		const cursor = event.target.result;
		if (cursor) {
			let card = document.createElement("div");
			card.classList.add("card");
			projectsList.appendChild(card);

			let title = document.createElement("h4");
			let projectName = cursor.value.projectName;
			title.innerHTML = `<a href="./project?p=${encodeURIComponent(projectName)}">${projectName}</a>`;
			card.appendChild(title);

			let deleteButton = document.createElement("div");
			deleteButton.classList.add("delete", "icon-trashcan");
			deleteButton.style.backgroundColor = "var(--danger)";
			deleteButton.onclick = () => {
				removeProject(projectName);
			}
			card.appendChild(deleteButton);

			cursor.continue();
		}
	};
}

function addProject() {
	let projectNameInput = document.getElementById("projectNameInput");
	let projectTypeInput = document.getElementById("projectType");
	let projectName = projectNameInput.value;
	let projectType = projectTypeInput.value;

	if (projectName && projectType) {
		let transaction = db.transaction(["projects"], "readwrite");
		let objectStore = transaction.objectStore("projects");
		
		let data = {
			projectName: projectName,
			type: projectType
		};
		if (projectType == "code") data.files = [];
		if (projectType == "art") data.layers = [];
		if (projectType == "note") data.content = "";
		let request = objectStore.add(data);

		request.onsuccess = function () {
			projectNameInput.value = "";
			displayProjects();
		};

		request.onerror = function (event) {
			console.error("Add project error: " + event.target.errorCode);
		};
	}
}

function removeProject(projectName) {
	const transaction = db.transaction(["projects"], "readwrite");
	const objectStore = transaction.objectStore("projects");
	const index = objectStore.index("projectName");

	const request = index.getKey(projectName);
	request.onsuccess = function (event) {
		const projectId = event.target.result;
		if (projectId !== undefined) {
			const deleteRequest = objectStore.delete(projectId);
			deleteRequest.onsuccess = function () {
				console.log("Project removed successfully");
				displayProjects();
			};

			deleteRequest.onerror = function (event) {
				console.error("Remove project error: " + event.target.errorCode);
			};
		} else {
			console.log("Project not found");
		}
	};

	request.onerror = function (event) {
		console.error("Get project error: " + event.target.errorCode);
	};
}
