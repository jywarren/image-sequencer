<<<<<<< HEAD
const staticCacheName = 'image-sequencer-static-v3.5.1';
=======
const staticCacheName = 'image-sequencer-static-v3';

>>>>>>> 4d996b9968f95fd7f6158bde3034d9f5c43f6737
self.addEventListener('install', event => {
  console.log('Attempting to install service worker');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName.startsWith('image-sequencer-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName){
          return caches.delete(cacheName);
        })
      );
    })
<<<<<<< HEAD
  );
=======
  );      
>>>>>>> 4d996b9968f95fd7f6158bde3034d9f5c43f6737
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
<<<<<<< HEAD
          if(event.request.method == 'GET')
=======
          if(event.request.method == "GET")
>>>>>>> 4d996b9968f95fd7f6158bde3034d9f5c43f6737
            cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
<<<<<<< HEAD
});

// When the update modal sends a 'skipWaiting' message, call the skipWaiting method.
self.addEventListener('message', function(event) {
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
=======
});
>>>>>>> 4d996b9968f95fd7f6158bde3034d9f5c43f6737
