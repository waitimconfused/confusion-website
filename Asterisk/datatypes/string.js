export function compress(str="") {
	const compressed = [];
	let count = 1;
	for (let i = 0; i < str.length; i++) {
		if (str[i] === str[i + 1]) {
			count++;
		} else {
			compressed.push(str[i] + count);
			count = 1;
		}
	}
	const compressedString = compressed.join('');
	return compressedString;
}
export function decompress(str=""){
	let split = str.split(/(.[0-9]*)/g);
	split = split.filter((str) => str !== "");
	let decompressed = "";

	split.forEach((str) => {
		let split = str.split(/(.)([0-9]*)/);
		split = split.filter((str) => str !== "");

		let char = split[0];
		let count = parseInt(split[1]);

		decompressed += char.repeat(count);
	});

	return decompressed;
}