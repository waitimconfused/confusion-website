window.addEventListener('load', function () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register('/service-worker.js')
			.then((registration) => {
				console.log('Service Worker registered with scope:', registration.scope);
			})
			.catch((error) => {
				console.error('Service Worker registration failed:', error);
			});
	} else {
		console.warn("navigator.serviceWorker does not exist. Cannot cache for offline use.");
	}
});