export var keys = [];

export var mouse = {
	x: -1,
	y: -1,
};

export function isKeyPressed(key=""){
	let indexOfKey = keys.indexOf(key);
	return(indexOfKey !== -1);
}
export function setKeyValue(key="", value=true){
	if(value == true){
		let indexOfKey = keys.indexOf(key);
		if(indexOfKey == -1) keys.push(key);
	}else{
		let indexOfKey = keys.indexOf(key);
		while(indexOfKey >= 0){
			keys.splice(indexOfKey, 1);
			indexOfKey = keys.indexOf(key);
		}
	}
}

document.body.addEventListener("mousewheel", (e) => {
	let scrollY = e.deltaY;
	let scrollX = e.deltaX;

	if(scrollY < 0){
		setKeyValue("scrollDown", true);
	}else{
		setKeyValue("scrollUp", true);
	}

	if(scrollX < 0){
		setKeyValue("scrollLeft", true);
	}else{
		setKeyValue("scrollRight", true);
	}

}, false);

document.onkeydown = (e) => {

	let key = e.key.toLowerCase();

	setKeyValue(key, true);
}
window.onresize = (e) => {
	e.preventDefault();
}
document.onkeyup = (e) => {
	setKeyValue(e.key, false);
}
window.onmousemove = (e) => {

	mouse.x = e.clientX;
	mouse.y = e.clientY;
}
document.oncontextmenu = (e) => {
	e.preventDefault();
	setKeyValue("mouseRightclick", true);
}
document.onmousedown = (e) => {

	if (e.button == 4) {
		setKeyValue("MouseWheelClick", true);
	}else{
		setKeyValue("mouseClick", true);
	}
};
document.onmouseup = () => {
	setKeyValue("mouseClick", false);
	setKeyValue("mouseRightClick", false);
	setKeyValue("mouseWheelClick", false);
};

// Prevent Touchpad actions
window.addEventListener('wheel', (e) => {
	e.preventDefault();
}, {passive: false});

window.addEventListener("gesturestart", function (e) {
	e.preventDefault();
}, {passive: false});

window.addEventListener("gesturechange", function (e) {
	e.preventDefault();
}, {passive: false})

window.addEventListener("gestureend", function (e) {
	e.preventDefault();
}, {passive: false});