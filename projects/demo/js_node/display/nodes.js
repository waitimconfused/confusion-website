import { globalGraph, calcDistance, camera, cameraTo, applyFocus, cameraGlideTo, delta, lerp, hexToRgb } from "../index.js";
import { keyPressed, mouse, setKey } from "../keyboard.js";
import { getFileOptions } from "../files/options.js";
import { nodeIsShiftClicked } from "./graph.js";

export default class Node {
	display = {
		x: 0,
		y: 0,
		radius: 10,
		title: "Untitled Node",
		colour: {
			r: 255,
			g: 0,
			b: 0
		},
		glyph: "?"
	};
	children = [];
	parents = [];
	isClicked = false;
	isHovered = false;
	constructor(title=this.display.title, graph=globalGraph){
		graph.addNode(this);

		this.display.title = title;
		if(title.match(/\..+$/g)?.length > 0){
			let colour = getFileOptions(title).data?.colour || "#FF0000";
			this.setColour(colour);
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
	setColour(colour=""){
		if(colour.startsWith("#")){
			let rgb = hexToRgb(colour);
			this.display.colour.r = rgb.r;
			this.display.colour.g = rgb.g;
			this.display.colour.b = rgb.b;
		}else if(colour.startsWith("rgb(")){
			let rgbArray = colour.split(/rgb\((\d*), *(\d*), *(\d*)\)/gm);
			this.display.colour.r = rgbArray[1];
			this.display.colour.g = rgbArray[2];
			this.display.colour.b = rgbArray[3];
		}
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
	focus(){
		cameraGlideTo(this);
		return this;
	}
	isHovering(){

		let displayX = globalGraph.canvas.width / 2 + (this.display.x - camera.x) * camera.zoom;
		let displayY = globalGraph.canvas.height / 2 + (this.display.y - camera.y) * camera.zoom;
		let radius = Math.abs(this.display.radius * camera.zoom);

		let hovering = calcDistance({
			x: displayX,
			y: displayY
		}, {
			x: mouse.position.x - globalGraph.canvas.getBoundingClientRect().left,
			y: mouse.position.y - globalGraph.canvas.getBoundingClientRect().top
		}) < radius;

		return hovering;
	}
	click(){

		if(mouse.click_l == true && this.isClicked == false){
			this.isClicked = this.isHovering();
		}

		if(this.isClicked && keyPressed("control")){
			// cameraTo(this.display.x, this.display.y);
			cameraGlideTo(this);
			this.isClicked = false;
		}
		if(this.isClicked && keyPressed("shift")){
			this.shiftClick();
		}
		return this;
	}
	shiftClick = function(){
		nodeIsShiftClicked(this);
	}

	addEventListener(eventName, callback=function(){}){
		if(eventName == "shiftClick") this.shiftClick = callback;
	}

	#lerpFrame = 0;
	#lerp = {
		radius: 0,
		textOffset: 0,
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
	render(){

		let mouseHovering = this.isHovering();

		if(mouseHovering){
			this.#lerp.radius += 10 * delta;
			this.#lerp.textOffset += 10 * delta;
			// this.#textOffset = Math.min(this.#textOffset + 100 * delta, 20);
			globalGraph.canvas.style.cursor = "pointer";
		}else{
			this.#lerp.radius -= 10 * delta;
			this.#lerp.textOffset -= 10 * delta;
			// this.#textOffset = Math.max(this.#textOffset - 100 * delta, 10);
		}
		this.#lerp.radius = Math.max(Math.min(this.#lerp.radius, 1), 0);
		this.#lerp.textOffset = Math.max(Math.min(this.#lerp.textOffset, 1), 0);

		if(mouseHovering && !this.isHovered) {
			globalGraph.setHoveredNode(true);
		}else if(!mouseHovering && this.isHovered && globalGraph.hasHoveredNode) {
			globalGraph.setHoveredNode(false);
		}

		this.isHovered = mouseHovering;

		let context = globalGraph.canvas.getContext("2d");
		let bgColour = this.display.colour;

		let displayX = globalGraph.canvas.width / 2 + (this.display.x - camera.x) * camera.zoom;
		let displayY = globalGraph.canvas.height / 2 + (this.display.y - camera.y) * camera.zoom;
		let radius = Math.abs(this.display.radius * camera.zoom);

		context.shadowColor = 'black';
		context.strokeStyle = "black";
		context.lineWidth = camera.zoom * 2;
		context.shadowBlur = camera.zoom * 2;
		context.beginPath();
		context.arc(displayX, displayY, radius + lerp(0, 10, this.#lerp.radius), 0, Math.PI * 2);
		context.stroke();
		context.closePath();
		
		// Shadow
		context.shadowBlur = 0;
		context.shadowColor = 'black';
		context.strokeStyle = "black";
		context.fillStyle = "black";
		context.beginPath();
		context.arc(displayX, displayY, radius + lerp(0, 10, this.#lerp.radius) + 1, 0, Math.PI * 2);
		context.fill();

		context.lineWidth = 5;
		context.shadowBlur = 0;
		context.fillStyle = `rgb(${bgColour.r}, ${bgColour.g}, ${bgColour.b})`;
		if(globalGraph.hasHoveredNode && !this.isHovered){
			context.fillStyle = "cyan";
		}

		context.fill();

		context.closePath();

		// Title
		context.beginPath();
		let t = camera.zoom - 0.5;
		let a = lerp(0, 1, t);
		if(a > 0){
			context.fillStyle = `rgba(255, 255, 255, ${a})`;
			context.font = "15px 'JetBrains Mono'";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			let textX = displayX;
			let textY = displayY + radius + lerp(0, 10, this.#lerp.textOffset) + 10;
			context.fillText(this.display.title, textX, textY);
			context.closePath();

			// Glyph
			context.beginPath();
			context.shadowColor = `rgba(0, 0, 0, ${a})`;
			context.strokeStyle = `rgba(0, 0, 0, ${a})`;
			context.fillStyle = `rgba(255, 255, 255, ${a})`;
			context.font = `bold ${this.display.radius * camera.zoom / 1.5 + lerp(0, 10, this.#lerp.radius)}px 'JetBrains Mono', 'Noto Emoji'`;
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.lineWidth = this.display.radius * camera.zoom / 10;
			context.strokeText(this.display.glyph, displayX, displayY);
			context.fillText(this.display.glyph, displayX, displayY);
			context.closePath();
		}

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
		this.children.forEach((node) => {
			let indexOfThis = node.parents.indexOf(this);
			if(indexOfThis == -1) return undefined;
			node.parents.splice(indexOfThis, 1);
		});
		delete this;
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