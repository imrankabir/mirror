self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  // Cache files or perform other tasks
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
