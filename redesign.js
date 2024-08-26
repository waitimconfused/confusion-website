const banner = new class Banner {
	content = "";
	show(skipAnimation=false) {
		if (skipAnimation || window.scrollY > 10) {
			document.querySelector("nav .banner").style.transitionDuration = "0ms";
			document.querySelector("nav").style.transitionDuration = "0ms";
			setTimeout(() => {
				document.querySelector("nav .banner").style.transitionDuration = null;
				document.querySelector("nav").style.transitionDuration = null;
			}, 450);
		}
		document.querySelector("nav .banner").classList.add("show");
	}
	hide() {
		document.querySelector("nav .banner").classList.remove("show");
	}
	toggle() {
		document.querySelector("nav .banner").classList.toggle("show");
	}
	setContent(text="") {
		this.content = `<p>${text}</p>`;
		document.querySelector("nav .banner").innerHTML = this.content;
		if (text) {
			document.querySelector("nav .banner").classList.add("exists");
		}
	}
	setColour(text="") {
		document.querySelector("nav .banner").style.backgroundColor = `var(--${text})`;
	}
}

document.onscroll = (e) => {
	if (banner.content.length > 0) {
		if ( window.scrollY > 10 ) document.querySelector("nav").classList.add("scroll");
		else document.querySelector("nav").classList.remove("scroll")
	}
}

banner.setContent("<strong>SALE!</strong> 100% off! <spanw style='margin-left: 1rem'></span> Sale ends NEVER!");
banner.setColour("accent");
banner.show(true);

document.querySelector("nav .sitename").onmouseenter = (e) => {
	document.querySelector("nav .sitename .img").classList.add("animate");
}
document.querySelector("nav .sitename").onmouseleave = (e) => {
	document.querySelector("nav .sitename .img").classList.remove("animate");
}

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


document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || getPreferredColorScheme());
localStorage.setItem("theme", document.documentElement.getAttribute("data-theme"));
document.body.querySelector(`#theme-toggle > [data-theme=${localStorage.getItem("theme")}]`).classList.add("hide");

var animateThemeChange = true;

function toggleTheme() {
	let theme = localStorage.getItem("theme");
	theme = (theme=="light")?"dark":"light";

	document.body.querySelector(`#theme-toggle > :not([data-theme=${theme}])`).classList.remove("hide");
	document.body.querySelector(`#theme-toggle > [data-theme=${theme}]`).classList.add("hide");

	if (animateThemeChange) {
		document.body.querySelector("#theme-toggle").onclick = () => {};

		document.body.querySelector(`div#theme-change-cover`).setAttribute("theme-to", theme);
		document.body.querySelector(`div#theme-change-cover`).classList.add("animate");

		setTimeout(() => {
			document.documentElement.setAttribute("data-theme", theme);
			localStorage.setItem("theme", theme);
		}, 500);

		setTimeout(() => {
			document.body.querySelector(`div#theme-change-cover`).classList.remove("animate");
			document.body.querySelector(`div#theme-change-cover`).removeAttribute("theme-to");
			document.body.querySelector("#theme-toggle").onclick = toggleTheme;
		}, 1000);
	} else {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}
}

document.body.querySelector("#theme-toggle").onclick = toggleTheme;

let documentLinks_scrollToID = document.querySelectorAll("a[href^='#']");
for (let i = 0; i < documentLinks_scrollToID.length; i ++) {
	let element = documentLinks_scrollToID[i];
	let id = element.href.split("#")[1];
	let linkedElement = document.querySelector(`#${id}`);
	element.removeAttribute("href");
	element.classList.add("clickable");
	// element.setAttribute("onclick", `document.querySelector("#${id}").scrollIntoView()`);
	element.onclick = () => {
		linkedElement.scrollIntoView();
	}
}
console.log(documentLinks_scrollToID);