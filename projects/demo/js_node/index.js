import Graph from "./display/graph.js";
export var globalGraph = new Graph;
import { keyPressed } from "./keyboard.js";

export var camera = {
	zoom: 3,
	x: 0,
	y: 0
}

var lastCalledTime = 0;
export var fps = 0;
export var delta;

export var redraw = true;
var escapePressed = false;

graphUpdate();

function graphUpdate(){

	if(escapePressed == true && !keyPressed("escape")){
		escapePressed = false;
	}else if(escapePressed == false && keyPressed("escape")){
		redraw = !redraw;
		escapePressed = true;
	}

	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;

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

export function cameraTo(x=0, y=0){
	camera.x = x;
	camera.y = y;
}
export function cameraMoveby(x=0, y=0){
	camera.x -= x / camera.zoom;
	camera.y -= y / camera.zoom;
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
		camera.zoom = Math.max(camera.zoom - e.deltaY * 0.01, 0.1)
	} else {
		if(e.target !== globalGraph.canvas) return undefined;
		e.preventDefault();
		cameraMoveby(-e.deltaX, -e.deltaY);
	}

}, {passive: false});

window.addEventListener("gesturestart", (e) => e.preventDefault(), {passive: false});
window.addEventListener("gesturechange", (e) => e.preventDefault(), {passive: false});
window.addEventListener("gestureend", (e) => e.preventDefault(), {passive: false});