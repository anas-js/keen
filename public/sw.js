const CACHE_NAME = 'offline-keen'
const urlsToCache = [
  '/',
  '/offline',           // صفحة fallback
  '/pwa/icon-192x192.png',
  '/pwa/icon-512x512.png',
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => {
        return response || caches.match('/offline')
      })
    )
  )
})