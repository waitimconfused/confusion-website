var player = new class {
	inventory = {
		items: [],
		removeItem: function(item){
			let indexOfItem = this.items.indexOf(item);
			if(indexOfItem == -1) return;
			this.items.splice(indexOfItem, 1);
		}
	}
}

var block = new class {

	type = "";
	variant = "";

	actions = {
		build: function(){},
		interact: function(){}
	}

	constructor(posX=0, posY=0, layer=0){

	}

}(0, 0, 0)

export var game = {
	
	get: function(runtimeParameters){
		let hashmap = {
			"block": block,
			player: player
		}
		return hashmap[runtimeParameters] || null;
	}
};