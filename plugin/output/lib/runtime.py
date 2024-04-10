class game:
	class block:
		def setBlock(block="") -> None: return None
		def getBlock() -> str: return str

class player:
	class inventory:
		def give(item="", quantity=1) -> None: return None
		def take(item="", quantity=1) -> None: return None