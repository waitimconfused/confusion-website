import page from "./pagebuilder.js";

page.new();

page.setHeader({
	icon: "/assets/favicon.png",
	title: "Pix-JS"
});

page.addSection({
	title: "Description",
	content: "Wanted to make a programing language that could be used for games, that \"compiles\" to JavaScript"
});