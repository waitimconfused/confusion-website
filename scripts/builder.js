export var header = new class {

	title = "";
	icon = "";
	links = [];

	#element = null;

	setTitle(title=""){
		this.title = title;
	}


	reload(){

		if(this.#element == null){
			this.#element = document.createElement("div");
			this.#element.className = "header";
			document.body.prepend(this.#element);

			this.#element.innerText = this.title;
		}

	}

}