const projectName = ( new URLSearchParams(window.location.search) ).get("p");
document.querySelector("title").innerText = document.querySelector("title").innerText.replace("■■■■■", projectName);

function format(command) {
	document.execCommand(command, false, null);
}
