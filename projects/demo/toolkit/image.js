const assetDIV = loadAssets();

const ErrorImage = document.createElement("img");
ErrorImage.src = "../../code/assets/img_not_found.png";
assetDIV.appendChild(ErrorImage);

export function loadAssets(){
	if(document.querySelectorAll("div#assets").length == 0){
		let assetDIV = document.createElement("div");
		assetDIV.setAttribute("id", "assets");
		assetDIV.setAttribute("style", "display:none;");
		document.body.appendChild(assetDIV);
		return(assetDIV);
	}
	return document.querySelector("div#assets");
}

export function draw(
	imgSource="",

	DestinationXPos=0, DestinationYPos=0,
	DestinationWidth=0, DestinationHeight=0,

	CropXPos=-1, CropYPos=-1,
	CropWidth=-1, CropHeight=-1,
	
	filters={
		alpha: 1,
		brightness: 1,
		pixelated: false
	},
	flipX=false,
	drawDestination=new HTMLCanvasElement
){

	let context = drawDestination.getContext("2d");
	context.globalAlpha = 1;
	context.globalAlpha = filters?.alpha;

	if(filters.pixelated){
		context.msImageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
	}

	context.save();
	if(flipX == true){
		context.scale(-1, 1);
		context.translate(
			0 - innerScreen.width,
			0
		);
		DestinationXPos = innerScreen.width - DestinationXPos - DestinationWidth;
	}

	if(CropXPos == -1) CropXPos = 0;
	if(CropYPos == -1) CropYPos = 0;

	if(CropWidth == -1) CropWidth = undefined;
	else CropWidth = Math.floor(CropWidth);
	if(CropHeight == -1) CropHeight = undefined;
	else CropHeight = Math.floor(CropHeight);

	try {
		context.drawImage(
			CacheImage(imgSource),

			CropXPos, CropYPos,
			CropWidth, CropHeight,

			DestinationXPos, DestinationYPos,
			DestinationWidth, DestinationHeight,
		);
	}catch {
		context.drawImage(
			ErrorImage,

			0, 0, ErrorImage.width, ErrorImage.height,

			Math.floor(DestinationXPos), Math.floor(DestinationYPos),
			Math.floor(DestinationWidth), Math.floor(DestinationHeight),
		);
	}
	context.restore();
	context.globalAlpha = 1;
}

export function CacheImage(imgSource=""){
	let loadedImage = document.querySelector(`div#assets>img[src="${imgSource}"]`);
	if(loadedImage == null){
		let newlyLoadedImage = document.createElement("img");
		newlyLoadedImage.src = imgSource;
		assetDIV.appendChild(newlyLoadedImage);
		return(newlyLoadedImage);
	}else{
		return(loadedImage);
	}
}