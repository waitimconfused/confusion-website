import messageData from "./index.json" assert {type: "json"};

const styles = {
	reset: "\x1b[0m",

	foreground: {
		Black: "\x1b[30m",
		Red: "\x1b[31m",
		Green: "\x1b[32m",
		Yellow: "\x1b[33m",
		Blue: "\x1b[34m",
		Magenta: "\x1b[35m",
		Cyan: "\x1b[36m",
		White: "\x1b[37m",
		Gray: "\x1b[90m"
	},
	background: {
		Black: "\x1b[40m",
		Red: "\x1b[41m",
		Green: "\x1b[42m",
		Yellow: "\x1b[43m",
		Blue: "\x1b[44m",
		Magenta: "\x1b[45m",
		Cyan: "\x1b[46m",
		White: "\x1b[47m",
		Gray: "\x1b[100m"
	}
};

export function write(type="", message, data){

	let timestamp = Date.now();

	let messageTitle = " "+timestamp+" - "+type+" ";

	let terminalWidth = process.stdout.columns;

	let beforeTitle = " ".repeat( Math.floor(terminalWidth / 2 - messageTitle.length / 2) );
	let afterTitle = " ".repeat( Math.floor(terminalWidth / 2 - messageTitle.length / 2) );
	let header = beforeTitle + messageTitle + afterTitle;
	while(header.length < terminalWidth) header += " ";
	let end = " ".repeat(terminalWidth);

	console.log(styles.background.Green+styles.foreground.Black + header + styles.reset);

	if(typeof message == "string") message = message.split("\n");

	message.forEach((line) => {
		let extra = terminalWidth - (line.length % terminalWidth);
		console.log(styles.background.Cyan + styles.foreground.Black + line + " ".repeat(extra));
	});
	console.log(end + styles.reset + "\n");
}

export function code(code="", data){
	let message = messageData[code].replaceAll("%d", data);
	write(code, message, data);
	return message;
}