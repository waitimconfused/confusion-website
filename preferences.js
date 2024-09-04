class PreferenceStruct {
	/**
	 * @type { string[] }
	 */
	options = [];
	/**
	 * @type { string }
	 */
	value = "";
	
	/**
	 * 
	 * @param  {...string} options 
	 */
	constructor(...options) {
		if (Array.isArray(options[0])) options = options[0];
		if (options[0].toLowerCase() == "bool") options = [ "true", "false" ];
		this.options = options;
	}

	/**
	 * 
	 * @param { string } value
	 * @returns { this }
	 */
	set(value) {
		if (typeof value != "string") {
			value = JSON.stringify(value);
		}
		this.value = value;
		return this;
	}
}
/**
	 * 
	 * @param  {...string} options 
	 */
function preferenceStruct(...options) {
	return new PreferenceStruct(options);
}

const preferences = new class Preferences {
	themeChangeAnimation = preferenceStruct("BOOL").set(true);
	theme = preferenceStruct("light", "dark").set(getPreferredColorScheme());
	redirectToDashboard = preferenceStruct("BOOL").set(false);

	constructor() {
		for (let key in this) {
			if (key in localStorage) {
				this[key].set( localStorage.getItem("prefer."+key) );
			}
			localStorage.setItem("prefer."+key, this[key].value);
			this[key].set( localStorage.getItem("prefer."+key) );
		}
	}
	set(key="", value="") {
		if (key in this == false) {
			console.error(`Cannot give user preference if preferences "${key}" does not exist`);
			return undefined;
		}
		localStorage.setItem("prefer."+key, value);
		this[key].set( localStorage.getItem("prefer."+key) );

		if (key == "theme") {
			let theme = this["theme"].value;
			if (this["themeChangeAnimation"] == "true") {
				let themeToggleButton = document.getElementById("theme-toggle");
				let themeToggleButtonClickEvent = themeToggleButton.onclick;
				themeToggleButton.onclick = () => {};
		
				document.body.querySelector(`div#theme-change-cover`).setAttribute("theme-to", theme);
				document.body.querySelector(`div#theme-change-cover`).classList.add("animate");
		
				setTimeout(() => {
					document.documentElement.setAttribute("data-theme", theme);
					localStorage.setItem("theme", theme);
					document.querySelector("meta[name='theme-color']").content = getComputedStyle(document.documentElement).getPropertyValue('--background');
				}, 500);
		
				setTimeout(() => {
					document.body.querySelector(`div#theme-change-cover`).classList.remove("animate");
					document.body.querySelector(`div#theme-change-cover`).removeAttribute("theme-to");
					themeToggleButton.onclick = themeToggleButtonClickEvent;
				}, 1000);
			} else {
				document.documentElement.setAttribute("data-theme", theme);
				localStorage.setItem("theme", theme);
				document.querySelector("meta[name='theme-color']").content = getComputedStyle(document.documentElement).getPropertyValue('--background');
			}
			if (window.location.pathname == "/dashboard/") {
				document.querySelector("select#theme").value = theme;
			}
		}
	}
	get(key="") {
		if (key in this == false) {
			console.error(`Cannot give user preference if preferences "${key}" does not exist`);
			return undefined;
		}

		return this[key].value;
	}
	getOptions(key="") {
		if (key in this == false) {
			console.error(`Cannot give user preference if "${key}" does not exist or have any options`);
			return undefined;
		}
		return this[key].options;
	}
}
window.preferences = preferences;

function getPreferredColorScheme() {
	if (window.matchMedia) {
		if(window.matchMedia('(prefers-color-scheme: dark)').matches){
			return 'dark';
		} else {
			return 'light';
		}
	}
	return 'light';
}