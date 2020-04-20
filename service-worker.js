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
            cache.addAll(['/', './PWA-Pure-HTML-CSS-Javascript/'])
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



window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});
