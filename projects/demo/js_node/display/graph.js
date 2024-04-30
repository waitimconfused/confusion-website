import { calcDistance, camera, delta, fps, hexToRgb, hideOptionsPane, redraw, showOptionsPane } from "../index.js";
import { keyPressed, mouse } from "../keyboard.js";
import Node from "./nodes.js";

var shiftClickedNode1 = null;
var shiftClickedNode2 = null;

export function nodeIsShiftClicked(node=new Node){
	if(!shiftClickedNode1){
		shiftClickedNode1 = node;
		return;
	}else if(!shiftClickedNode2){
		shiftClickedNode2 = node;
	}

	shiftClickedNode1.connectTo(shiftClickedNode2);
	shiftClickedNode2 = null;
	shiftClickedNode1 = null;
}

export default class Graph {
	canvas = document.createElement("canvas");

	styles = {
		size: { width: "100%", height: "100%" },
		bg: { r: 35, g: 35, b: 35, },
		tags: {}
	}

	#nodeData = {};
	nodeIndexes = [];
	hasHoveredNode = false;

	setBG(colour=""){
		if(colour.startsWith("#")){
			let rgb = hexToRgb(colour);
			this.styles.bg.r = rgb.r;
			this.styles.bg.g = rgb.g;
			this.styles.bg.b = rgb.b;
		}else if(colour.startsWith("rgb(")){
			let rgbArray = colour.split(/rgb\((\d*), *(\d*), *(\d*)\)/gm);
			this.styles.bg.r = rgbArray[1];
			this.styles.bg.g = rgbArray[2];
			this.styles.bg.b = rgbArray[3];
		}
	}
	addTag(tag="", options={}){
		this.styles.tags[tag] = options;
		if(options.colour){
			this.styles.tags[tag].colour = hexToRgb(options.colour);
		}
	}
	getTag(tag=""){
		return this.styles.tags[tag];
	}
	setSize(width, height){
		this.styles.size.width = (typeof width == "number")?width+"px":width;
		this.styles.size.height = (typeof height == "number")?height+"px":height;
		window.onresize();
	}

	constructor(){
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.canvas.style.position = "fixed";
		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.style.userSelect = "none";
		this.canvas.style.zIndex = -1;
		window.onresize = () => {
			let width = this.styles.size.width;
			let height = this.styles.size.height;
			if(width.trim().endsWith("%")){
				this.canvas.width = document.documentElement.clientWidth * parseInt(width.replace("%","")) / 100;
			}else if(width.trim().endsWith("px")){
				this.canvas.width = parseInt(width.replace("px",""));
			}
			if(height.trim().endsWith("%")){
				this.canvas.height = document.documentElement.clientHeight * parseInt(height.replace("%","")) / 100;
			}else if(height.trim().endsWith("px")){
				this.canvas.height = parseInt(height.replace("px",""));
			}
		}
		window.onresize();
		this.enableEditing();
	}

	RGBfromXY(x=0, y=0){
		let context = this.canvas.getContext("2d");
		let rgbArray = context.getImageData(x, y, 1, 1).data;

		return {
			r: rgbArray[0],
			g: rgbArray[1],
			b: rgbArray[2]
		}
	}

	disableEditing(){
		this.canvas.ondblclick = () => {}
		hideOptionsPane();
	}
	enableEditing(){
		this.canvas.ondblclick = () => {
			(new Node).moveTo(
				mouse.position.x - this.canvas.width / 2 + camera.x * camera.zoom,
				mouse.position.y - this.canvas.height / 2 + camera.y * camera.zoom
			);
		}
		showOptionsPane();
	}

	addNode(node=new Node){
		this.#nodeData[node.token] = node;
		this.nodeIndexes = Object.keys(this.#nodeData);
	}
	removeNode(node=new Node){
		if(node.token in this.#nodeData) delete this.#nodeData[node.token];
		else throw Error("Could not find Node with token: "+node.token);
		this.nodeIndexes = Object.keys(this.#nodeData);
	}

	getNode(token="") {
		return this.#nodeData[token];
	}

	tryClick(){
		console.log("trying to press nodes...");
		for(let nodeIndex = 0; nodeIndex < this.nodeIndexes.length; nodeIndex ++){
			let nodeToken = this.nodeIndexes[nodeIndex];
			console.log(" - "+nodeToken);
			let node = this.#nodeData[nodeToken];
			node.click();
		}
	}

	setHoveredNode(bool=false, node=new Node){
		this.hasHoveredNode = bool;
		if(bool){
			this.hoveredNode = node;
		}
	}

	render(){

		this.canvas.style.cursor = "default";
		this.canvas.style.backgroundColor = `rgb(${this.styles.bg.r}, ${this.styles.bg.g}, ${this.styles.bg.b})`;

		if(shiftClickedNode1 && !keyPressed("shift")) {
			shiftClickedNode1 = null;
			shiftClickedNode2 = null;
		}

		let context = this.canvas.getContext("2d");

		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Sort from back to front
		this.nodeIndexes = this.nodeIndexes.sort((nodeToken1, nodeToken2) => {
			let node1 = this.getNode(nodeToken1);
			let node2 = this.getNode(nodeToken2);
			let biggestRadius = Math.max(node1.display.radius, node2.display.radius);
			return (node2.display.y - biggestRadius) - (node1.display.y - biggestRadius)
		});
		for(let nodeIndex = 0; nodeIndex < this.nodeIndexes.length; nodeIndex ++){
			let nodeToken = this.nodeIndexes[nodeIndex];
			let node = this.#nodeData[nodeToken];
			if(redraw){
				centralForce(node);
			}

			for(let otherNodeIndex = 0; otherNodeIndex < this.nodeIndexes.length; otherNodeIndex ++){
				let otherNodeToken = this.nodeIndexes[otherNodeIndex];
				if(otherNodeIndex == nodeIndex) continue
				let otherNode = this.#nodeData[otherNodeToken];
				node.script();
				preventNodeOverlap(node, otherNode);

				if(redraw){
					limitNodePosition(node, otherNode);
					limitNodePosition(otherNode, node);
				}
			}

			if(redraw && node.children.length > 0){
				for(let childIndex = 0; childIndex < node.children.length; childIndex ++){
					let childToken = node.children[childIndex];
					let child = this.#nodeData[childToken];
					limitConnectedNodePosition(node, child);
					limitConnectedNodePosition(child, node);
				}
			}
		}

		for(let nodeIndex = 0; nodeIndex < this.nodeIndexes.length; nodeIndex++){
			let nodeToken = this.nodeIndexes[nodeIndex];
			let node = this.#nodeData[nodeToken];

			for(let childIndex = 0; childIndex < node.children.length; childIndex ++){
				let childToken = node.children[childIndex];
				let child = this.#nodeData[childToken];

				if(calcDistance(node.display, child.display) > node.size * 10) continue;


				let nodeDisplayX = this.canvas.width / 2 + (node.display.x - camera.x) * camera.zoom;
				let nodeDisplayY = this.canvas.height / 2 + (node.display.y - camera.y) * camera.zoom;

				let childDisplayX = this.canvas.width / 2 + (child.display.x - camera.x) * camera.zoom;
				let childDisplayY = this.canvas.height / 2 + (child.display.y - camera.y) * camera.zoom;

				let a = Math.max(node.lerp.radius, child.lerp.radius);
				let nodeColour = node.getStyling().background;
				let rgb = {
					r: nodeColour.r*a,
					g: nodeColour.g*a,
					b: nodeColour.b*a
				};
				if(a == child.lerp.radius) {
					let nodeColour = child.getStyling().background;
					rgb.r = nodeColour.r*a;
					rgb.g = nodeColour.g*a;
					rgb.b = nodeColour.b*a;
				}
				drawArrow(context, nodeDisplayX, nodeDisplayY, childDisplayX, childDisplayY, 0.5, rgb);
			}
		}

		for(let nodeIndex = 0; nodeIndex < this.nodeIndexes.length; nodeIndex++){
			let nodeToken = this.nodeIndexes[nodeIndex];
			let node = this.#nodeData[nodeToken];

			node.render();
		}
		
		if(redraw == false){
			context.fillStyle = "white";
			context.roundRect(10, 10, 10, 25, 3);
			context.roundRect(25, 10, 10, 25, 3);
			context.fill();
		}

		context.fillStyle = "white";
		context.font = "bold 48px serif";
		context.textAlign = "start";
		context.textBaseline = "top"
		context.fillText(Math.round(fps) * 10, 0, 0);
	}
}


function drawArrow(context, startX, startY, endX, endY, arrowPercentage, rgb={r:0,g:0,b:0}) {
    var dx = endX - startX;
    var dy = endY - startY;
    var length = Math.sqrt(dx * dx + dy * dy);
    var arrowLength = 5 * camera.zoom; // Constant arrow head size

    // Calculate the angle
    var angle = Math.atan2(dy, dx);

    // Calculate the position of the arrow head
    var arrowX = startX + (arrowPercentage+0.1) * dx;
    var arrowY = startY + (arrowPercentage+0.1) * dy;

    // Draw the line
    context.beginPath();
	context.lineCap = "round";
	context.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	context.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    // Draw the arrow head
    context.beginPath();
	context.lineCap = "round";
	context.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	context.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    context.moveTo(
		arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
		arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
	);
    context.lineTo(
		arrowX,
		arrowY
	);
    context.lineTo(
		arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
		arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
	);
	context.stroke();
    context.closePath();
}

function range(min, number, max){
	if(isNaN(number)) number = min;
	return Math.max(Math.min(number, max), min);
}

function calVelocity(dist, prefDist, maxSpeed=1, t=1){
	let timeToAjust = maxSpeed * t;
	prefDist -= 1;
	return Math.min( (Math.max(dist - prefDist + timeToAjust, 0)) * (1 / timeToAjust) - 1, 1) * maxSpeed;
}
function calcSpeed(){
	return fps / 60;
}

function centralForce(node=new Node){
	let speed = calcSpeed();

	let distance = calcDistance(node.display, {x:0, y:0});
	let velocity = calVelocity(distance, 0, 100 * (delta * speed), 100);
	let dx = -node.display.x;
	let dy = -node.display.y;

	let node_RadianAngle = Math.atan( (dx / dy) || 1 ) + Math.PI * (node.display.y < 0);

	let node_changeX = velocity * Math.sin(node_RadianAngle);
	let node_changeY = velocity * Math.cos(node_RadianAngle);

	node.display.x -= node_changeX;
	node.display.y -= node_changeY;
}

function limitConnectedNodePosition(anchorNode=new Node, freeNode=new Node, dontMove=false){

	if(anchorNode == freeNode) return undefined;
	if(
		anchorNode.hasChild(freeNode) == false &&
		freeNode.hasChild(anchorNode) == false
	) return undefined;

	let speed = calcSpeed();

	let distance = calcDistance(anchorNode.display, freeNode.display);
	let velocity = calVelocity(distance, 50, 200 * (delta * speed), 100);
	let dx = anchorNode.display.x - freeNode.display.x;
	let dy = anchorNode.display.y - freeNode.display.y;

	let freeNode_RadianAngle = Math.atan(dx / dy) + Math.PI * (freeNode.display.y > anchorNode.display.y);

	if(freeNode.isClicked == false){
		let freeNode_changeX = velocity * Math.sin(freeNode_RadianAngle);
		let freeNode_changeY = velocity * Math.cos(freeNode_RadianAngle);

		freeNode.display.x += freeNode_changeX;
		freeNode.display.y += freeNode_changeY;
	}

}

function limitNodePosition(anchorNode=new Node, freeNode=new Node){

	if(anchorNode == freeNode) return undefined;
	if(
		anchorNode.hasChild(freeNode) == true ||
		freeNode.hasChild(anchorNode) == true
	) return undefined;

	let speed = calcSpeed();

	let distance = calcDistance(anchorNode.display, freeNode.display);
	let preferedDistance = 200;

	if(distance > preferedDistance) return undefined;

	let velocity = calVelocity(distance, preferedDistance, (100/3) * (delta * speed), 100);
	let step = velocity;
	let dx = anchorNode.display.x - freeNode.display.x;
	let dy = anchorNode.display.y - freeNode.display.y;

	let freeNode_RadianAngle = Math.atan(dx / dy) + Math.PI * (freeNode.display.y > anchorNode.display.y);

	if(freeNode.isClicked == false){
		let freeNode_changeX = step * Math.sin(freeNode_RadianAngle);
		let freeNode_changeY = step * Math.cos(freeNode_RadianAngle);

		freeNode.display.x += freeNode_changeX;
		freeNode.display.y += freeNode_changeY;
	}

}

function preventNodeOverlap(anchorNode=new Node, freeNode=new Node){
	if(freeNode.isClicked == true) return undefined;

	if(anchorNode == freeNode) return undefined;

	let speed = calcSpeed();
	let distance = calcDistance(anchorNode.display, freeNode.display);
	let step = 1 * (delta * speed);
	let dx = anchorNode.display.x - freeNode.display.x;
	let dy = anchorNode.display.y - freeNode.display.y;

	while(distance < anchorNode.display.radius + freeNode.display.radius + 10){

		let radianAngle = Math.atan(dx / dy) + Math.PI * (anchorNode.display.y > freeNode.display.y);

		let changeX = step * Math.sin(radianAngle);
		let changeY = step * Math.cos(radianAngle);

		freeNode.display.x += changeX;
		freeNode.display.y += changeY;

		anchorNode.display.x -= changeX;
		anchorNode.display.y -= changeY;

		distance = calcDistance(anchorNode.display, freeNode.display);
	}
}