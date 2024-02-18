function makeHttpObject() {
	try {return new XMLHttpRequest();}
	catch (error) {}
	try {return new ActiveXObject("Msxml2.XMLHTTP");}
	catch (error) {}
	try {return new ActiveXObject("Microsoft.XMLHTTP");}
	catch (error) {}

	throw new Error("Could not create HTTP request object.");
}

var request = makeHttpObject();
request.open("GET", "/index.html", true);
request.send(null);
request.onreadystatechange = function() {
	if (request.readyState == 4){
		let html = request.responseText;

		let iframe = document.createElement("iframe");
		iframe.style.display = "none";
		document.body.appendChild(iframe);

		let iframeDocument = iframe.contentWindow.document;

		iframeDocument.body.innerHTML = html;

		let iframeAside = iframeDocument.getElementsByTagName("aside")[0];

		document.getElementsByTagName("aside")[0].innerHTML = iframeAside.innerHTML;

		iframe.remove();
	}
}