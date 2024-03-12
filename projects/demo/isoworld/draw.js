import { camera, canvas, tileSize } from "./index.js";
import { image } from "./image.js";
import { Point2D, XYZ_iso } from "./points.js";
import { getBlock, indexFromXYZ, world } from "./world.js";

const tileOffsets = {
	"house_south": new Point2D(-19, -15),
	"windmill_building": new Point2D(-22, -19),
	"windmill_blade[1]": new Point2D(5, -40),
	"windmill_blade[2]": new Point2D(3.9, -43),
}

export function drawBlock(x=0, y=0, z=0){
	let block = getBlock(x, y, z);

	if(block == "empty") return;

	let offset = new Point2D(0, 0);
	if(block in tileOffsets) offset = tileOffsets[block];
	let screenPos = XYZ_iso(x, y, z);

	screenPos.x += offset.x;
	screenPos.y += offset.y;

	let sway = Math.sin( performance.now() / 250 ) * tileSize / 8;
	// screenPos.y += sway;

	let svg = document.querySelector(`div#assets>img[src="./assets/${block}.svg"]`);
	let spriteWidth = tileSize;
	let spriteHeight = tileSize;
	if(svg){
		// let boundingBox = svg.getBBox();
		spriteWidth = svg.width;
		spriteHeight = svg.height;
	}

	let posX = screenPos.x * camera.scale + canvas.width / 2 - (spriteWidth - tileSize / 2) * camera.scale;
	let posY = screenPos.y * camera.scale + canvas.height / 2 - (spriteHeight - tileSize / 2) * camera.scale;

	image(
		"./assets/"+block+".svg",
		posX + camera.x,
		posY + camera.y,
		spriteWidth * camera.scale,
		spriteHeight * camera.scale,
		0,
		0, spriteWidth, spriteHeight, {}
	);
}