const gridCells = document.querySelectorAll(".grid div.card");
const gridHolders = document.querySelectorAll(".grid");
var style = getComputedStyle(document.body);
var cssColours = [ "--text", "--primary", "--secondary", "--accent" ];

var mouse = {
	x: 0, y: 0,
	relative: function(element=new HTMLElement){
		let elementRect = element.getBoundingClientRect();
		let x = this.x - elementRect.left;
		let y = this.y - elementRect.top;
		var scaleX = elementRect.width / element.offsetWidth;
		var scaleY = elementRect.height / element.offsetHeight;
		x /= scaleX;
		y /= scaleY;
		return { x, y };
	},
};

for(let i = 0; i < gridHolders.length; i++){
	let gridHolder = gridHolders[i];
	shuffleGrid(gridHolder);
}
function range(min, value, max){
	return Math.max(Math.min(value, max), min);
}
function random(start,end){
	return Math.floor(Math.random() * (end - start + 1) + start);
}
function shuffleGrid(element){
	var nextShuffle = function(){
		shuffleGrid(element);
	}
	if(element.matches(":hover") == false && element.matches(":active") == false){
		let sideLength = Math.sqrt(element.childElementCount);
		shuffleGridCells();

		let columns = [];
		for(let i = 0; i < sideLength; i ++){
			let randomNumber = random(1, sideLength);
			columns.push(`${randomNumber}fr`);
		}

		let rows = [];
		for(let i = 0; i < sideLength; i ++){
			let randomNumber = random(1, sideLength);
			rows.push(`${randomNumber}fr`);
		}

		element.style.gridTemplateColumns = columns.join(" ");
		element.style.gridTemplateRows = rows.join(" ");
		element.style.transitionDuration = null;
		setTimeout(nextShuffle, random(400, 1000));
	}else{
		let elementRect = element.getBoundingClientRect();
		let elementWidth = elementRect.width;
		let relativePos = mouse.relative(element);
		let relativeX = relativePos.x;
		let relativeY = relativePos.y;

		let gap = 16;
		let centerWidth = elementWidth / 3;
		
		if(element.matches(":active")) centerWidth *= 1.25;
		
		centerWidth = Math.min(centerWidth, elementWidth - gap * 4 - 16 * 4)

		let columnLeft = relativePos.x - gap * 2 - centerWidth / 2;
		columnLeft = range(16*2, columnLeft, elementWidth - gap * 4 - centerWidth - 16*2);
		let columnRight = elementWidth - columnLeft - gap * 4 - centerWidth;
		columnRight = range(16*2, columnRight, elementWidth);
		element.style.gridTemplateColumns = `${columnLeft}px ${centerWidth}px ${columnRight}px`;
		
		
		let columnUp = relativePos.y - gap * 2 - centerWidth / 2;
		columnUp = range(16*2, columnUp, elementWidth - gap * 4 - centerWidth - 16*2);
		let columnDown = elementWidth - columnUp - gap * 4 - centerWidth;
		columnDown = range(16*2, columnDown, elementWidth);
		element.style.gridTemplateRows = `${columnUp}px ${centerWidth}px ${columnDown}px`;

		element.style.transitionDuration = "100ms";
		window.requestAnimationFrame(nextShuffle);
	}
}

function shuffleGridCells(){
	for(let i = 0; i < gridCells.length; i ++){
		let gridCell = gridCells[i];
		let randomIndex = Math.floor(Math.random()*cssColours.length);
		let colour = style.getPropertyValue(cssColours[randomIndex]);
		gridCell.style.backgroundColor = colour;
	}
}
shuffleGridCells();

document.onmousemove = (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}