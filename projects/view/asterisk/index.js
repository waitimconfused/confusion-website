import page from "../pagebuilder.js";

page.new();

page.setHeader({
	icon: "/assets/favicon.png",
	title: "Asterisk"
});

page.addSection({
	title: "Description",
	content: "Hosting a local server, made easy.\n\nUsing no external Node modules, only bult in NodeJS functions."
});