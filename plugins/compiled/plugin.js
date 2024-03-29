import { game, player } from "./lib.runtime.js"
import * as random from "./random.js"



export var thisBlock = 0

export function place() {
	player.inventory.take("block/chest")
	game.block.setBlock("chest:unopened")
}


export function interact() {
	let amount = random.randint(1, 3)

	if(player.inventory.has("item/key") == false) return

	player.inventory.take("item/key")
	player.inventory.give("item/diamond", amount)
	game.block.setBlock("chest:opened")

	return Math.abs(100)
}