import page from "./pagebuilder.js";

export default async function(project){
	if(!project){
		document.body.innerHTML = "<iframe src='/404.html' style='position:fixed;top:0px;left:0px;width:100vw;height:100vh;border:none;outline:none;'></iframe>";
		return;
	}

	let root = window.location.protocol + "//" + window.location.host + "/";
	let isHomePage = window.location.href == root;
	if(project == "confusion" && !isHomePage){
		window.location.href = "/";
	}
	
	let response = await fetch(`/projects/markdown/${project}.md`);

	let markdown = await response.text();

	let h1 = markdown.split(/^# {0,}(.*)/g)[1];

	page.new();

	page.setHeader({
		icon: "/assets/favicon.png",
		title: h1,
		tryItButton: !isHomePage
	});

	let sections = markdown.replace(/^# {0,}(.*)/g, "");
	sections = sections.replace(/^(\s*)/g, "");
	sections = sections.split("## ");

	sections.forEach((content) => {
		content = content.replace(/^(\s*)/g, "");
		if(!content) return;

		let h2 = content.split(/^([\S ]*)/g)[1];
		h2 = h2.replace(/^(\s*)/g, "");
		let p = content.split(/^([\S ]*)/g)[2];
		p = p.replace(/^(\s*)/g, "");
		p = p.replace(/(\s*)$/g, "");
		p = p.replaceAll("\n", "<br>");

		p = p.replaceAll(/\[([\S\s]+?)\]\(([\S]+?)\)/g, "<a href='$2'>$1</a>");
		p = p.replaceAll(/```(\w*)\n*([\s\S]+?)\n*```/gm, "<div class='code block' lang='$1'>$2</div>");
		p = p.replaceAll(/`([\s\S]+?)`/g, "<div class='code'>$1</div>");

		page.addSection({
			title: h2,
			content: p
		});
	})
}