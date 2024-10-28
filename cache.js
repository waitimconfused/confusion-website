window.addEventListener('load', async function () {
	if ("serviceWorker" in navigator) {
		let registration = await navigator.serviceWorker.register('/service-worker.js');
		if (registration.installing) {
			console.debug("Service worker installing");
		} else if (registration.waiting) {
			console.debug("Service worker installed");
		} else if (registration.active) {
			console.debug("Service worker active with scope:", registration.scope);
		}
	} else {
		console.warn("navigator.serviceWorker does not exist. Cannot cache for offline use.");
	}
});