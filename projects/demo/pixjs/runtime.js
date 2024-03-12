function getObjectValue_fromKeys(object={}, keys=[""]){

	let value = keys.reduce((obj, key) => (obj || {})[key], object);
  
	return value;
  }
  function setObjectValue_fromKeys(object={}, keys=[""], newValue=""){
  
	keys.reduce((obj, key, index, keys) => {
	  if (index === keys.length - 1) {
		obj[key] = newValue; // set new value
	  } else {
		return (obj || {})[key];
	  }
	}, object);
  
	return object;
  }

var player = new class {
	inventory = {
		items: [],
		removeItem: function(item){
			let indexOfItem = this.items.indexOf(item);
			if(indexOfItem == -1) return;
			this.items.splice(indexOfItem, 1);
		},
		set: function(key, value){
			this = setObjectValue_fromKeys(this, key.split("."), value);
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

	set(key, value){
		this = setObjectValue_fromKeys(this, key.split("."), value);
	}

	constructor(posX=0, posY=0, layer=0){

	}

}(0, 0, 0);

export var game = {
	
	get: function(runtimeParameters){
		let hashmap = {
			"block": block,
			player: player
		}
		return hashmap[runtimeParameters] || null;
	}
};