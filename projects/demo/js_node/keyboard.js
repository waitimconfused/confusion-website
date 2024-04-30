import { globalGraph, cameraTo, changeZoom, setZoom, camera, initalCameraZoom } from "./index.js";

export var keyboard = [];
export var mouse = {
	click_l: false,
	click_r: false,

	position: {
		x: 0,
		y: 0
	}
};

export function keyPressed(key=""){
	return keyboard.includes(key);
}

export function setKey(key="", pressed=true){
	if(pressed == true && !keyPressed(key)){
		keyboard.push(key);
	}else if(keyPressed(key)){
		keyboard.splice( keyboard.indexOf(key), 1 );
	}
}
window.onfocus = () => {
	setKey("control", false);
}

document.onkeydown = (e) => {

	let hoveredElement = document.elementFromPoint(mouse.position.x, mouse.position.y);

	if(hoveredElement != globalGraph.canvas) return undefined;

	setKey("control", false);

	let key = e.key.toLowerCase();
	if(keyPressed(key) == false) setKey(key, true);

	if(e.ctrlKey){
		if(key == "+" || key == "=") {
			e.preventDefault();
			changeZoom(camera.zoom / 10);
		}else if(key == "-" || e.key == "_") {
			e.preventDefault();
			changeZoom(camera.zoom / -10);
		}else if(key == "0") {
			setZoom(initalCameraZoom);
			cameraTo(0, 0);
		}else if(key != "r" && (!e.shiftKey && key != "i")){
			e.preventDefault();
		}
	}
}
document.onkeyup = (e) => {
	keyboard.splice( keyboard.indexOf(e.key), 1 );
	setKey("control", false);
}

document.onmousedown = (e) => {
	mouse.click_l = true;
	if(e.target == globalGraph.canvas) globalGraph.tryClick();
}
document.onmouseup = () => {
	mouse.click_l = false;
}
document.onmousemove = (e) => {
	mouse.position.x = e.clientX - globalGraph.canvas.getBoundingClientRect().left;
	mouse.position.y = e.clientY - globalGraph.canvas.getBoundingClientRect().top;
}