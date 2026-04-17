self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Simple fetch handler to satisfy PWA requirements
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response('Network error occurred');
    })
  );
});
