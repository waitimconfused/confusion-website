import { engine, ComponentGroup } from "https://waitimconfused.github.io/confusion-projects/game-engine/utils.js";
import { Canvas, Circle } from "https://waitimconfused.github.io/confusion-projects/game-engine/components/index.js";
import { mouse } from "https://waitimconfused.github.io/confusion-projects/toolbelt/toolbelt.js";

const projectName = (new URLSearchParams(window.location.search)).get("p");
document.querySelector("title").innerText = document.querySelector("title").innerText.replace("■■■■■", projectName);

const colourPicker = document.getElementById("colour-picker");
const layersDiv = document.getElementById("layer-holder");

/**
 * @type {{ size: number, mode: "pencil" | "eraser" }}
 */
var brush = {
	size: 10,
	mode: "pencil"
}

engine.setBackground("#E0E0E0");
var layers = new ComponentGroup;
var currentLayer = 0;
engine.addObject(layers);

var projectWidth = 500;
var projectHeight = 500;

function createLayer() {
	let canvas = new Canvas;
	canvas.colour = (layers.componentHashes.length == 0) ? "white" : "transparent";
	layers.addObject(canvas);
	canvas.moveTo(0, 0);
	canvas.setSize(projectWidth, projectHeight);

	return canvas;
}

const dot = new Circle;
engine.addObject(dot);
dot.radius = 10;
dot.colour = "black";
dot.outline.colour = "rgba(255, 255, 255, 0.5)";
dot.outline.size = 5;

dot.script = () => {
	dot.moveTo( engine.mouse.toWorld() );
}

let lastMousePos = { x: 0, y: 0 }; 
mouse.addHook({
	updateFunc: () => {
		let canvasMouse = engine.mouse.toWorld();
		let canvas = layers.getObject( currentLayer );
		if (!canvas) return;
		if (Math.round(canvasMouse.x) == lastMousePos.x && Math.round(canvasMouse.y) == lastMousePos.y) return;
		if (engine.mouse.click_l && engine.canvas.matches(":active")) {
			canvas.context.fillStyle = colourPicker.getAttribute("value");
			canvas.context.beginPath();
			canvas.context.arc(canvasMouse.x + canvas.display.w/2, canvasMouse.y + canvas.display.h/2, 10, 0, 2 * Math.PI);
			canvas.context.closePath();
			canvas.context.fill();
			lastMousePos.x = Math.round(canvasMouse.x);
			lastMousePos.y = Math.round(canvasMouse.y);
			// saveProject();
		}
	}
});

engine.canvas.onmouseup = saveProject;

var db;
const request = indexedDB.open("projectsDB", 1);

request.onsuccess = function (event) {
	db = event.target.result;
	loadProject();
};

request.onerror = function (event) {
	console.error("Database error: " + event.target.errorCode);
};

function loadProject() {
	let transaction = db.transaction(["projects"], "readonly");
	let objectStore = transaction.objectStore("projects");
	let index = objectStore.index("projectName");

	let request = index.get(projectName);
	request.onsuccess = function (event) {
		/** @type {{ layers: string[] }} */
		let project = event.target.result;

		if (!project) { console.error("Project not found"); return; }

		projectWidth = project.width;
		projectHeight = project.height;


		if (project.layers.length == 0) {
			project.layers.push("");
		}

		for (let i = 0; i < project.layers.length; i ++) {
			let layerData = project.layers[i];
			let canvas = createLayer(layerData);

			let layer = new Image(projectWidth, projectHeight);
			layer.onload = () => {
				canvas.context.drawImage(layer, 0, 0, projectWidth, projectHeight);
			}
			layer.src = layerData;

			let layerDiv = document.createElement("div");
			layersDiv.appendChild(layerDiv);
			layerDiv.classList.add("row");

			let img = document.createElement("img");
			layerDiv.appendChild(img);
			img.width = projectWidth / 3;
			img.height = projectHeight / 3;
			img.src = layerData;

			let h4 = document.createElement("h4");
			layerDiv.appendChild(h4);
			h4.innerText = "Layer " + (i + 1);
		}

	};

	request.onerror = function (event) {
		console.error("Get project error: " + event.target.errorCode);
	};
}


function saveProject() {
	let transaction = db.transaction(["projects"], "readwrite");
	let objectStore = transaction.objectStore("projects");
	let index = objectStore.index("projectName");

	let layersData = [];

	for (let i = 0; i < layers.componentHashes.length; i ++) {
		let component = layers.getObject(i);
		let dataURL = component.documentElement.toDataURL();
		let layerImageElement = layersDiv.querySelector(`div:nth-child(${i+1}) img`);
		layerImageElement.src = dataURL;
		layersData.push(dataURL);
	}

	let request = index.get(projectName);
	request.onsuccess = function (event) {
		let project = event.target.result;
		if (project) {
			project.layers = layersData;

			let updateRequest = objectStore.put(project);
			updateRequest.onsuccess = function () { console.log("Saved Project") };

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
}