import * as tb from "https://waitimconfused.github.io/confusion-projects/toolbelt/toolbelt.js";

const sideNavs = document.querySelectorAll(".sidenav");

var lastMousePos = { x: 0, y: 0 };
for (let i = 0; i < sideNavs.length; i ++) {
	let layerMenu = document.body.querySelector(`.sidenav:nth-of-type(${i+1})`);
	let layerMenuToggle = document.body.querySelector(`.sidenav:nth-of-type(${i+1}) .handle`);
	let layerMenuToggleDots = document.body.querySelector(`.sidenav:nth-of-type(${i+1}) .handle .dots`);

	layerMenuToggle.style.top = i * 150 + 25 + "px";

	layerMenu.setAttribute("dragging", "false")

	layerMenuToggle.addEventListener("mousedown", (e) => {
		lastMousePos = tb.mouse.position;
	});

	layerMenuToggle.addEventListener("mouseup", (e) => {
		if (lastMousePos.x != tb.mouse.position.x && lastMousePos.y != tb.mouse.position.y) return;
		lastMousePos = tb.mouse.position;
		if (layerMenu.classList.contains("open")) {
			closeSidenav(layerMenu);
		} else {
			openSidenav(layerMenu);
		}
	});

	layerMenuToggle.addEventListener("keydown", (e) => {
		if (e.key != " ") return;
		if (layerMenu.getAttribute("dragging") == "true") return;
		if (layerMenu.classList.contains("open")) {
			closeSidenav(layerMenu);
		} else {
			openSidenav(layerMenu);
		}
	});

	dragElement(layerMenuToggle, layerMenuToggleDots);
}

/**
 * 
 * @param { HTMLElement } elmnt
 * @param { HTMLElement } handle
 */
function dragElement(elmnt, handle) {
	let startX = 0;
	let startY = 0;
	if (handle) {
		// if present, the header is where you move the DIV from:
		handle.onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;

		startX = e.clientX;
		startY = e.clientY;

		setTimeout(() => {
			elmnt.parentNode.setAttribute("dragging", "true");
		}, 100);
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		let parentRect = elmnt.parentElement.getBoundingClientRect();
		let elmntHandleRect = handle.getBoundingClientRect();

		elmnt.style.top = tb.toRange(25,  e.clientY - handle.offsetTop - elmntHandleRect.height/2, window.innerHeight - 25) + "px";

		let side = elmnt.parentNode.classList.contains("right") ? "right" : "left";

		if (side == "right" && e.clientX < window.innerWidth / 2) {
			elmnt.parentNode.classList.remove("right");
			elmnt.parentNode.classList.add("left");
		} else if (side == "left" && e.clientX > window.innerWidth / 2) {
			elmnt.parentNode.classList.add("right");
			elmnt.parentNode.classList.remove("left");
		}

		if (
			elmnt.parentNode.classList.contains("open") == false &&
			(side == "right" && e.clientX < window.innerWidth - parentRect.width/2) ||
			(side == "left" && e.clientX > parentRect.width/2)
		) {
			openSidenav(elmnt.parentNode);
		} else if (
			elmnt.parentNode.classList.contains("open") &&
			(side == "right" && e.clientX > window.innerWidth - parentRect.width/2) ||
			(side == "left" && e.clientX < parentRect.width/2)
		) {
			closeSidenav(elmnt.parentNode);
		}
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

function openSidenav(sidenav) {
	let side = sidenav.classList.contains("right") ? "right" : "left";
	let openTabs = document.querySelectorAll(`.sidenav.${side}.open`);
	for (let i = 0; i < openTabs.length; i ++) {
		let openTab = openTabs[i];
		openTab.classList.remove("open");
	}
	sidenav.classList.add("open");
}

function closeSidenav(sidenav) {
	sidenav.classList.remove("open");
}