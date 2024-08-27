var db;
const request = indexedDB.open("projectsDB", 1);
var projectName = "Untitled";
// Most options demonstrate the non-default behavior
var contentField = new SimpleMDE({
	element: document.getElementById("content"),
	spellChecker: false,
	autosave: false,
	autoFocus: true,
	status: false,
	toolbarTips: false,
	lineWrapping: false,
	hideIcons: [
		"guide",
		"side-by-side",
		"fullscreen"
	]
});
request.onsuccess = function (event) {
	db = event.target.result;
	display();
};

request.onerror = function (event) {
	console.error("Database error: " + event.target.errorCode);
};

function getProjectNameFromURL() {
	let urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('p');
}

function display() {
	projectName = getProjectNameFromURL();
	contentField.innerHTML = "";

	if (projectName) {
		let transaction = db.transaction(["projects"], "readonly");
		let objectStore = transaction.objectStore("projects");
		let index = objectStore.index("projectName");

		let request = index.get(projectName);
		request.onsuccess = function (event) {
			let project = event.target.result;
			if (project) {
				document.querySelector("head title").innerText = `${projectName} | Confusion`
				contentField.value(project.content);
			} else {
				console.log("Project not found");
			}
		};

		request.onerror = function (event) {
			console.error("Get project error: " + event.target.errorCode);
		};
	}
}

contentField.codemirror.on("change", function(){
	let transaction = db.transaction(["projects"], "readwrite");
	let objectStore = transaction.objectStore("projects");
	let index = objectStore.index("projectName");

	let request = index.get(projectName);
	request.onsuccess = function (event) {
		let project = event.target.result;
		if (project) {
			project.content = contentField.value();

			let updateRequest = objectStore.put(project);
			updateRequest.onsuccess = function () { /* Saved Note */ };

			updateRequest.onerror = function (event) {
				console.error("Failed to save note.");
			};
		} else {
			console.log("Note does not exist.");
		}
	};

	request.onerror = function (event) {
		console.error("Get project error: " + event.target.errorCode);
	};
});