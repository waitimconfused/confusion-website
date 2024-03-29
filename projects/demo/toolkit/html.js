import * as tk from "./index.js";

tk.keyboard.setKeybind((event) => {
	console.log(event);
}, [ "a", "s" ]);