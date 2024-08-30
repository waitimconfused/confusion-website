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
	let projectsList = document.getElementById("project-list");
	projectsList.innerHTML = "";

	let transaction = db.transaction(["projects"], "readonly");
	let objectStore = transaction.objectStore("projects");

	objectStore.openCursor().onsuccess = function (event) {
		let cursor = event.target.result;
		if (cursor) {
			let projectName = cursor.value.projectName;
			let projectType = cursor.value.type;
			let card = document.createElement("a");
			card.classList.add("card");
			card.href = `./project?p=${encodeURIComponent(projectName)}`;
			card.style.cursor = "default";
			card.setAttribute("draggable", "true")
			projectsList.prepend(card);

			let projectTypeIcon = document.createElement("span");
			projectTypeIcon.classList.add(`project-icon`);
			if (projectType == "code") {
				projectTypeIcon.classList.add(`icon-code`);
			} else if (projectType == "art") {
				projectTypeIcon.classList.add(`icon-squiggle`);
			} else if (projectType == "note") {
				projectTypeIcon.classList.add(`icon-note`);
			}
			card.appendChild(projectTypeIcon);

			let title = document.createElement("h4");
			title.innerHTML = projectName;
			title.style.marginBottom = "4rem";
			card.appendChild(title);

			let buttonDiv = document.createElement("div");
			buttonDiv.classList.add("options");
			card.appendChild(buttonDiv);

			let openButton = document.createElement("a");
			openButton.classList.add("icon", "icon-link_open");
			openButton.href = `./project?p=${encodeURIComponent(projectName)}`;
			openButton.target = "_blank";
			openButton.style.backgroundColor = "var(--danger)";
			buttonDiv.appendChild(openButton);

			let deleteButton = document.createElement("div");
			deleteButton.classList.add("icon", "icon-trashcan");
			deleteButton.style.backgroundColor = "var(--danger)";
			deleteButton.onclick = () => {
				removeProject(projectName);
			}
			buttonDiv.appendChild(deleteButton);

			card.onclick = (e) => {
				if (e.target != card && e.target.getAttribute("href")) return;
				e.preventDefault();
			};

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
		if (projectType == "note") data.notes = [];
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
