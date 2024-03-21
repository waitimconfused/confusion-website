import { globalGraph, calcDistance, camera, cameraTo, applyFocus } from "../index.js";
import { keyPressed, mouse, setKey } from "../keyboard.js";
import { getFileOptions } from "../files/options.js";

export default class Node {
	display = {
		x: 0,
		y: 0,
		radius: 10,
		title: "Untitled Node",
		colour: "#ff0000",
		glyph: "?"
	};
	children = [];
	parents = [];
	isClicked = false;
	constructor(title=this.display.title, graph=globalGraph){
		graph.addNode(this);

		this.display.title = title;
		if(title.match(/\..+$/g)?.length > 0){
			this.display.colour = getFileOptions(title).data?.colour || "purple";
			this.display.glyph = getFileOptions(title).data?.text || "?";
		}

		this.moveTo(
			(Math.random() * globalGraph.canvas.width / 2 - globalGraph.canvas.width / 4),
			(Math.random() * globalGraph.canvas.height / 2 - globalGraph.canvas.height / 4)
		);
		return this;
	}
	setTitle(title=this.display.title){
		this.display.title = title || this.display.title;
		return this;
	}
	connectTo(node=new Node){
		this.children.push(node);
		node.parents.push(this);
		// node.display.radius += 5;
		return this;
	}
	moveTo(screenX=0, screenY=0){
		this.display.x = screenX / camera.zoom;
		this.display.y = screenY / camera.zoom;
		return this;
	}
	isHovering(){

		let displayX = globalGraph.canvas.width / 2 + (this.display.x - camera.x) * camera.zoom;
		let displayY = globalGraph.canvas.height / 2 + (this.display.y - camera.y) * camera.zoom;
		let radius = Math.abs(this.display.radius * camera.zoom);

		return calcDistance({
			x: displayX,
			y: displayY
		}, {
			x: mouse.position.x - globalGraph.canvas.getBoundingClientRect().left,
			y: mouse.position.y - globalGraph.canvas.getBoundingClientRect().top
		}) < radius
	}
	click(){

		if(mouse.click_l == true && this.isClicked == false){
			this.isClicked = this.isHovering();
		}

		if(this.isClicked && keyPressed("control")){
			cameraTo(this.display.x, this.display.y);
			this.isClicked = false;
		}
		if(this.isClicked && keyPressed("shift")){
			this.shiftClick();
			setKey("shift", false);
			this.isClicked = false;
		}
		return this;
	}
	shiftClick = function(node=new Node){}

	addEventListener(eventName, callback=function(){}){
		if(eventName == "shiftClick") this.shiftClick = callback;
	}

	#value = "";
	setValue(value=""){
		this.#value = (value);
	}
	getValue(){
		return (this.#value);
	}

	script(){

		if(this.isClicked){

			this.moveTo(
				mouse.position.x - globalGraph.canvas.width / 2 + camera.x * camera.zoom,
				mouse.position.y - globalGraph.canvas.height / 2 + camera.y * camera.zoom
			);
			applyFocus(this);

			if(mouse.click_l == false){
				this.isClicked = false;
			}
		}
		return this;
	}
	hasParent(node=new Node){
		return this.parents.includes(node);
	}
	hasChild(node=new Node){
		return this.children.includes(node);
	}
	hasSibling(node=new Node){
		let isSibling = false;
		this.parents.forEach((parent=new Node) => {
			if(parent.hasChild(node)) isSibling = true;
		});
		return isSibling;
	}
	render(showNode=true){

		let context = globalGraph.canvas.getContext("2d");

		let displayX = globalGraph.canvas.width / 2 + (this.display.x - camera.x) * camera.zoom;
		let displayY = globalGraph.canvas.height / 2 + (this.display.y - camera.y) * camera.zoom;
		let radius = Math.abs(this.display.radius * camera.zoom);

		context.shadowColor = 'black';
		context.strokeStyle = "black";
		context.lineWidth = camera.zoom * 2;
		context.shadowBlur = camera.zoom * 2;
		context.beginPath();
		context.arc(displayX, displayY, radius, 0, Math.PI * 2);
		context.stroke();
		context.closePath();


		context.shadowBlur = 0;
		context.shadowColor = 'black';
		context.strokeStyle = "black";
		context.fillStyle = "black";
		context.beginPath();
		context.arc(displayX, displayY, radius + 1, 0, Math.PI * 2);
		context.fill();
		context.closePath();

		context.beginPath();
		context.fillStyle = this.display.colour;
		context.arc(displayX, displayY, radius, 0, Math.PI * 2);

		let mouseHovering = calcDistance({
			x: displayX,
			y: displayY
		}, mouse.position) < radius;

		if(mouseHovering){
			context.fillStyle = "white";
			context.font = "15px Arial";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			let textX = displayX;
			let textY = displayY + radius + 10;
			context.shadowColor = 'black';
			context.lineWidth = 5;
			context.shadowBlur = 0;
			context.strokeText(this.display.title, textX, textY);
			context.fillText(this.display.title, textX, textY);
			context.fillStyle = this.display.colour;
			globalGraph.canvas.style.cursor = "click";
		}
		context.fill();
		context.closePath();

		context.beginPath();
		context.shadowColor = 'black';
		context.strokeStyle = "black";
		context.fillStyle = "white";
		context.font = `${this.display.radius * camera.zoom / 1.5}px Arial`;
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.shadowBlur = 0;
		context.lineWidth = this.display.radius * camera.zoom / 10;
		context.strokeText(this.display.glyph, displayX, displayY);
		context.fillText(this.display.glyph, displayX, displayY);
		context.closePath();

		return this;
	}
	remove(){
		let indexOfThis = globalGraph.nodes.indexOf(this);
		if(indexOfThis == -1) return undefined;
		globalGraph.nodes.splice(indexOfThis, 1);
		this.parents.forEach((node) => {
			let indexOfThis = node.children.indexOf(this);
			if(indexOfThis == -1) return undefined;
			node.children.splice(indexOfThis, 1);
		});
		// delete this;
	}
}

function getRegexGroups(regex=new RegExp(), string="", groups=1){
	let regexGroups = [];
	let item;

	while (item = regex.exec(string)){
		for(let group = 0; group < groups; group ++){
			regexGroups.push(item[group]);
		}
	}

	return regexGroups;
}