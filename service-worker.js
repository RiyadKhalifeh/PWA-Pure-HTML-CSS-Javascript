// check if the serviceWorker object exists in the navigator object
if ('serviceWorker' in navigator) {

    // attach event listener  on page l aod
    window.addEventListener('load', function() {

        // register serviceWorker withthe [service-worker.js] file
        navigator.serviceWorker.register('./service-worker.js').then(registration => {

            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });

    });
}

// install event for the service worker
self.addEventListener('install', e => {

    e.waitUntil(
        caches.open('site-static').then(cache => {
            cache.addAll(['/', '/index.html'])
        })
    )

})


self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/index-offline.html");
                }
            });
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("gih-cache")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});