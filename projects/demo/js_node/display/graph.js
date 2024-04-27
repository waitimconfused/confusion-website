import { calcDistance, camera, delta, fps, hideOptionsPane, redraw, showOptionsPane } from "../index.js";
import { keyPressed } from "../keyboard.js";
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

	bg = {
		r: 35,
		g: 35,
		b: 35,
	};
	setBG(colour=""){
		if(colour.startsWith("#")){
			let rgb = hexToRgb(colour);
			this.bg.r = rgb.r;
			this.bg.g = rgb.g;
			this.bg.b = rgb.b;
		}else if(colour.startsWith("rgb(")){
			let rgbArray = colour.split(/rgb\((\d*), *(\d*), *(\d*)\)/gm);
			this.bg.r = rgbArray[1];
			this.bg.g = rgbArray[2];
			this.bg.b = rgbArray[3];
		}
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
			this.canvas.width = document.documentElement.clientWidth;
			this.canvas.height = document.documentElement.clientHeight;
		}
		window.onresize();
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
				mouse.position.x - globalGraph.canvas.width / 2 + camera.x * camera.zoom,
				mouse.position.y - globalGraph.canvas.height / 2 + camera.y * camera.zoom
			);
		}
		showOptionsPane();
	}

	nodes = [];
	hasHoveredNode = false;

	addNode(node=new Node){
		this.nodes.push(node);
	}

	tryClick(){
		this.nodes.forEach( (node=new Node) => {
			node.click();
		});
	}

	setHoveredNode(bool=false, node=new Node){
		this.hasHoveredNode = bool;
		if(bool){
			this.hoveredNode = node;
		}
	}

	render(){

		this.canvas.style.cursor = "default";
		this.canvas.style.backgroundColor = `rgb(${this.bg.r}, ${this.bg.g}, ${this.bg.b})`;

		if(shiftClickedNode1 && !keyPressed("shift")) {
			shiftClickedNode1 = null;
			shiftClickedNode2 = null;
		}

		let context = this.canvas.getContext("2d");

		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Sort from back to front
		this.nodes = this.nodes.sort((node1, node2) => {
			let biggestRadius = Math.max(node1.display.radius, node2.display.radius);
			return (node2.display.y - biggestRadius) - (node1.display.y - biggestRadius)
		});
		this.nodes.forEach( (node=new Node) => {

			if(redraw){
				centralForce(node);
			}

			this.nodes.forEach( (otherNode=(new Node)) => {
				node.script();
				preventNodeOverlap(node, otherNode);

				if(redraw){
					limitNodePosition(node, otherNode);
					limitNodePosition(otherNode, node);
				}
			} );

			if(node.children.length > 0){
				node.children.forEach( (edge=(new Node).edges[0]) => {
					if(redraw){
						limitConnectedNodePosition(node, edge);
						limitConnectedNodePosition(edge, node);
					}
				});
			}

		} );
		this.nodes.forEach( (node=new Node) => {

			if(node.children.length > 0){
				
				node.children.forEach( (edge=(new Node).edges[0]) => {

					if(calcDistance(node.display, edge.display) > node.size * 10) return undefined;


					let nodeDisplayX = this.canvas.width / 2 + (node.display.x - camera.x) * camera.zoom;
					let nodeDisplayY = this.canvas.height / 2 + (node.display.y - camera.y) * camera.zoom;

					let edgeDisplayX = this.canvas.width / 2 + (edge.display.x - camera.x) * camera.zoom;
					let edgeDisplayY = this.canvas.height / 2 + (edge.display.y - camera.y) * camera.zoom;

					let a = Math.max(node.lerp.radius, edge.lerp.radius);
					let rgb = {
						r: node.display.colour.r*a,
						g: node.display.colour.g*a,
						b: node.display.colour.b*a
					};
					if(a == edge.lerp.radius) {
						rgb.r = edge.display.colour.r*a;
						rgb.g = edge.display.colour.g*a;
						rgb.b = edge.display.colour.b*a;
					}
					drawArrow(context, nodeDisplayX, nodeDisplayY, edgeDisplayX, edgeDisplayY, 0.5, rgb);

				} );
			}

		} );

		this.nodes.forEach( (node=new Node) => {
			node.render();
		} );
		
		if(redraw == false){
			context.fillStyle = "white";
			context.roundRect(10, 10, 10, 25, 3);
			context.roundRect(25, 10, 10, 25, 3);
			context.fill();
		}
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
	context.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	context.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    // Draw the arrow head
    context.beginPath();
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


function centralForce(node=new Node){
	let speed = fps / 60;

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

	let speed = fps / 60;

	let distance = calcDistance(anchorNode.display, freeNode.display);
	let velocity = calVelocity(distance, 50, 75 * (delta * speed), 100);
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

function limitNodePosition(anchorNode=new Node, freeNode=new Node, dontMove=false){

	if(anchorNode == freeNode) return undefined;
	if(
		anchorNode.hasChild(freeNode) == true ||
		freeNode.hasChild(anchorNode) == true
	) return undefined;

	let speed = fps / 60;

	let distance = calcDistance(anchorNode.display, freeNode.display);
	let preferedDistance = 200;

	if(distance > preferedDistance) return undefined;

	let velocity = calVelocity(distance, preferedDistance, 33.333 * (delta * speed), 100);
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

	let speed = fps / 60;
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