import Graph from "./display/graph.js";
import Node from "./display/nodes.js";
export var globalGraph = new Graph;
import { keyPressed, mouse } from "./keyboard.js";
import { Pane } from 'https://cdn.skypack.dev/tweakpane';

export var camera = {
	zoom: 3,
	x: 0,
	y: 0
}
export const initalCameraZoom = structuredClone(camera.zoom);

var lastCalledTime = 0;
export var fps = 0;
export var delta;

export var redraw = true;
var escapePressed = false;

graphUpdate();

var optionsPane = new Pane({ title: 'Node Options' });
var focusedNode = null;
var focusedNode_prev = null;

function graphUpdate(){
	
	console.log(camera.zoom);

	if(escapePressed == true && !keyPressed("escape")){
		escapePressed = false;
	}else if(escapePressed == false && keyPressed("escape")){
		redraw = !redraw;
		escapePressed = true;
	}
	
	if(focusedNode !== focusedNode_prev && focusedNode !== null) {
		veiwNode(focusedNode);
	}
	focusedNode_prev = focusedNode;

	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;

	cameraGlide();

	globalGraph.render();
	window.requestAnimationFrame(graphUpdate);
	// setTimeout(graphUpdate, 1000 / 60);
}

export function changeZoom(factor=0){
	setZoom(camera.zoom + factor);
}
export function setZoom(factor=camera.zoom){
	camera.zoom = Math.max(factor, 0);
}
var glideTo = null;
export function cameraTo(x=0, y=0){
	camera.x = x;
	camera.y = y;
}
export function cameraMoveby(x=0, y=0){
	camera.x -= x / camera.zoom;
	camera.y -= y / camera.zoom;
}

export function cameraGlideTo(node=new Node){
	glideTo = node;
}

function cameraGlide(){
	if(!glideTo) return;

	let distanceX = camera.x - glideTo.display.x;
	let distanceY = camera.y - glideTo.display.y;

	if(Math.abs(distanceX) < 1 && Math.abs(distanceY) < 1){
		glideTo = null;
		return;
	}
	
	cameraMoveby(
		distanceX * 10 * delta,
		distanceY * 10 * delta
	)

}

export function calcDistance(start={x:0,y:0}, end={x:0,y:0}){
	return Math.hypot(
		start.x - end.x,
		start.y - end.y
	);
}
export function getRegexGroups(regex=new RegExp(), string=""){
	return [...string.matchAll(regex)];
}

window.addEventListener('wheel', (e) => {

	if (e.ctrlKey) {
		e.preventDefault();
		if(e.target !== globalGraph.canvas) return undefined;
		camera.zoom = Math.max(camera.zoom - e.deltaY * 0.01, 0.1);
	} else {
		if(e.target !== globalGraph.canvas) return undefined;
		e.preventDefault();
		cameraMoveby(-e.deltaX, -e.deltaY);
	}

}, {passive: false});

window.addEventListener("gesturestart", (e) => e.preventDefault(), {passive: false});
window.addEventListener("gesturechange", (e) => e.preventDefault(), {passive: false});
window.addEventListener("gestureend", (e) => e.preventDefault(), {passive: false});

export function applyFocus(node){
	focusedNode = node;
}

globalGraph.canvas.ondblclick = () => {
	(new Node).moveTo(
		mouse.position.x - globalGraph.canvas.width / 2,
		mouse.position.y - globalGraph.canvas.height / 2
	);
}

function veiwNode(node=new Node){

	optionsPane?.dispose();
	optionsPane = new Pane({ title: 'Node Options' });

	if(!node) return;

	let options = structuredClone(node.display);

	Object.keys(options).forEach((item) => {
		if(typeof options[item] == "function") return;
		if(typeof options[item] == "object") return;
		if(item == "x" || item == "y") return;

		let title = `${item}`;
		title = title.replaceAll("_", " ");
		title = title.toLowerCase();
		title = title.split(" ");
		title = title.map(word => word.charAt(0).toUpperCase() + word.slice(1));
		title = title.join(" ");

		optionsPane.addBinding(options, item, { label: title });
	});

	optionsPane.addBlade({
		view: 'separator',
	});

	const saveButton = optionsPane.addButton({
		title: 'Save'
	});
	saveButton.on('click', () => {
		options.x = node.display.x;
		options.y = node.display.y;
		node.display = options;
		focusedNode = null;
		veiwNode(node);
	});

	optionsPane.addButton({
		title: 'Remove Node'
	}).on('click', () => {
		node.remove();
		veiwNode(node);
	});
}

export function lerp(a, b, t) {
	t = Math.max(Math.min(t, 1), 0);
	return a + (b - a) * t
}