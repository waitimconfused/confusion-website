export var world = [];
export var worldWidth = 3;
export var worldLength = 3;
export var worldHeight = 4;

for(let y = 0; y < worldLength; y ++){
	for(let x = 0; x < worldWidth; x ++){
		world.push("dirt");
	}
}

for(let y = 0; y < worldLength; y ++){
	for(let x = 0; x < worldWidth; x ++){
		world.push("grass");
	}
}

for(let y = 0; y < worldLength; y ++){
	for(let x = 0; x < worldWidth; x ++){
		world.push("empty");
	}
}

for(let y = 0; y < worldLength; y ++){
	for(let x = 0; x < worldWidth; x ++){
		world.push("empty");
	}
}

setBlock(0, 0, 2, "windmill_building")
setBlock(1, 0, 2, "windmill_blade")
setBlock(0, 1, 2, "house_south")

export function indexFromXYZ(x=0, y=0, z=0){
	return (x) + (y * worldWidth) + (z * worldWidth * worldLength);
}

export function setBlock(x=0, y=0, z=0, block=""){
	let index = indexFromXYZ(x, y, z);
	world[index] = block;
}

export function getBlock(x=0, y=0, z=0){
	let index = indexFromXYZ(x, y, z);

	let block = world[index];

	let formatedBlock = block;

	if(block == "windmill_blade"){
		let frameCount = 2;
		let speed = 3;
		let timer = performance.now() / 1000;
		formatedBlock += `[${ Math.ceil( timer * speed % frameCount ) }]`;
	}

	return formatedBlock;
}