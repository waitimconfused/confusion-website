from lib.runtime import game, player
import random

thisBlock = 0

def place():
	player.inventory.take("block/chest")
	game.block.setBlock("chest:unopened")

def interact():
	amount = random.randint(1, 3)
	if(player.inventory.has("item/key") == False): return
	player.inventory.take("item/key")
	player.inventory.give("item/diamond", amount)
	game.block.setBlock("chest:unopened")

	return abs(100)

class player:
	class inventory:
		def take(item="", quantity=1): return None