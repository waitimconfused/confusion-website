const cacheName = "my-cache-v1";
const assetsToCache = [
	"/index.html",

	"/index.js",
	"/preferences.js",

	"/styles/theme.css",
	"https://fonts.googleapis.com/css?family=Poppins:700|Inter:400",
	"https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
	"https://fonts.googleapis.com/css2?family=Linefont:wght@4..1000&display=swap",

	"/assets/favicon.png",
	"/assets/favicon.svg",

	
	"/cache.js",
	"/service-worker.js",
	"/cache.json"
];

if (navigator.onLine) {
	console.log("Caching pages...");
} else {
	console.log("Using cached pages");
}

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(assetsToCache).catch((error) => {
				console.error(`Failed to cache`, assetsToCache, error);
				throw error;
			});
		}).finally(() => {
			console.log("Successfully cached pages:", assetsToCache);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request).then((fetchResponse) => {
				return caches.open(cacheName).then((cache) => {
					cache.put(event.request, fetchResponse.clone());
					return fetchResponse;
				});
			});
		}).finally(() => {
			console.log("Successfully loaded cached pages:", assetsToCache);
		})
	);
});
