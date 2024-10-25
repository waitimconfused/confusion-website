const cacheName = 'my-cache-v1';

var request = await fetch("/cache.json");
/**
 * @type {{
 * 	cache: string[]
 * }}
 */
var cache = await request.json();
var assetsToCache = cache.cache;

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(assetsToCache).catch((error) => {
				console.error(`Failed to cache`, assetsToCache, error);
				throw error;
			});
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request).then((fetchResponse) => {
				return caches.open(cacheName).then((cache) => {
					cache.put(event.request, fetchResponse.clone());
					return fetchResponse;
				});
			});
		})
	);
});
