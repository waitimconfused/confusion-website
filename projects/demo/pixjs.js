import convert from "./pixjs/convert.js";
import { Stylesheet, stylize, stylizeJavascript, stylizePIXJS } from "./pixjs/style.js";

let original = document.body.innerText;
let str = convert(document.body.innerText);
document.body.innerHTML = "";

const PixJs_stylesheet = new Stylesheet;

PixJs_stylesheet.addRule(/# {0,}(.+)$/gm, "<span class='comment'># $1</span>");

PixJs_stylesheet.addRule(/^(\t?)(def)/gm, "$1<span class='mem-declare'>$2</span>");
PixJs_stylesheet.addRule(/"(.+?)"/gm, "<span class='string'>\"$1\"</span>");
PixJs_stylesheet.addRule(/(\w+)( {0,})\(/gm, "<span class='mem-func'>$1$2(</span>");
PixJs_stylesheet.addRule(/([\(\)\[\]\{\}])/gm, "<span class='bracket'>$1</span>");
PixJs_stylesheet.addRule(/return/gm, "<span class='return'>return</span>");
PixJs_stylesheet.addRule(/async/gm, "<span class='async'>async</span>");
PixJs_stylesheet.addRule(/await/gm, "<span class='await'>await</span>");

const JavaScript_stylesheet = new Stylesheet;

JavaScript_stylesheet.addRule(/\/\/ {0,}(.+)$/gm, "<span class='comment'>// $1</span>");

JavaScript_stylesheet.addRule(/export/gm, "<span class='export'>export</span>");
JavaScript_stylesheet.addRule(/function/gm, "<span class='mem-declare'>function</span>");
JavaScript_stylesheet.addRule(/^(\t?)(var|let|const)/gm, "$1<span class='mem-declare'>$2</span>");
JavaScript_stylesheet.addRule(/"(.+?)"/gm, "<span class='string'>\"$1\"</span>");
JavaScript_stylesheet.addRule(/(\w+)( {0,})\(/gm, "<span class='mem-func'>$1$2(</span>");
JavaScript_stylesheet.addRule(/([\(\)\[\]\{\}])/gm, "<span class='bracket'>$1</span>");
JavaScript_stylesheet.addRule(/return/gm, "<span class='return'>return</span>");
JavaScript_stylesheet.addRule(/async/gm, "<span class='async'>async</span>");
JavaScript_stylesheet.addRule(/await/gm, "<span class='await'>await</span>");

let styledPIXJS = stylize(original, PixJs_stylesheet);
document.body.innerHTML += "<div>"+styledPIXJS+"</div>";
let styledJavaScript = stylize(str, JavaScript_stylesheet);
document.body.innerHTML += "<div>"+styledJavaScript+"</div>";

async function doimport(contents="") {
  let b64moduleData = "data:text/javascript;base64," + btoa(contents);
  let module = await import(b64moduleData);
  return module;
}

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

var game = {
	
	get: function(runtimeParameters){
		let hashmap = {
			"block": block,
			player: player
		}
		return hashmap[runtimeParameters] || null;
	}
};

let module = await doimport(str);
module.built(game, window);