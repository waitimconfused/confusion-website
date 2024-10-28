const cacheName = "offline_mode-cache";
const defaultAssets = [
	"/index.html",
	"/dashboard/index.html",
	"/404.html",
	"/components.html",
	"/index.js",
	"/preferences.js",
	"/styles/theme.css",

	"/assets/favicon.png",
	"/assets/favicon.svg",

	"/cache.js",
	"/service-worker.js",
	"/cache.json"
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(defaultAssets).catch((error) => {
				console.error(`Failed to cache`, defaultAssets, error);
				throw error;
			});
		})
	);
});

var useCache = true;
self.addEventListener("fetch", (event) => {
	if (event.request.mode == "navigate") {
		useCache = false;
		console.log("Welcome new user!");
	}
	event.respondWith(handleFetch(event));
});

/**
 * 
 * @param {Event} event
 */
async function handleFetch(event) {
	if (useCache) {
		const cachedResponse = await caches.match(event.request.url);
		return cachedResponse || await caches.match("/404.html");
	}

	try {
		const response = await fetch(event.request);
		if (response && response.status === 200 && response.type === 'basic') {
			const responseClone = response.clone();
			caches.open('my-cache').then((cache) => {
				cache.put(event.request.url, responseClone);
			});
		}
		return response;
	} catch (error) {
		if (useCache == false) {
			console.error(`Failed to fetch`, event.request.url, `. Switching to using cache.`);
		}
		useCache = true;
		const cachedResponse = await caches.match(event.request.url);
		return cachedResponse || new Response(error, { status: 503 });
	}
}