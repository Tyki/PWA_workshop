var version = '3';
var prefix = 'showcase';
var staticCacheName = `${prefix}-static-v${version}`;

var expectedCaches = [
  staticCacheName
];

self.addEventListener('install', function(event) {
  console.log('installing')
  self.skipWaiting() 

  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        './index.html',
        './js/main.js',
        './css/style.css',
        './images/dog_attack.jpg'
      ])
      .catch(error => {
        console.error(error)
      })
    })
  )
})

self.addEventListener('activate', function(event) {
  console.log("activate")
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key.startsWith(prefix + '-')
            && !key.startsWith(`${prefix}-article-`)
            && expectedCaches.indexOf(key) == -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Cache first
  event.respondWith(
    caches.open(staticCacheName).then(function (cache) {
      // Verify the cache

      return cache.match(event.request).then(function (response) {
        if (response) {
          console.log('Response from cache for ' + event.request.url)
          return response
        }
        // Something in cache? Return it, otherwise fetch online and put in cache
        return fetch(event.request).then(function (response) {
          console.log('Response from Apache ' + event.request.url)
          cache.put(event.request, response.clone())

          return response
        }) 
      })
    })
  )

  // StaleWhileRevalidate

  /*event.respondWith(
    caches.open(staticCacheName).then(function (cache) {
      // return cache match if any and update cache for next time
      return cache.match(event.request).then(function(response) {
        if (response) {
          console.log('Response from cache for ' + event.request.url)
        }

        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          console.log('Response from Apache for next update ' + event.request.url)
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  )*/









  // Pourquoi du HTTPS? Voila pourquoi ! 
  /*event.respondWith(
    caches.open(staticCacheName).then(function (cache) {
      // Verify the cache
      return cache.match(event.request).then(function (response) {
        if (event.request.url.indexOf('cat_attack.jpg') !== -1) {
          return cache.match('./images/dog_attack.jpg')
        }

        if (response) {
          console.log('Response from cache for ' + event.request.url)
          return response
        }
        // Something in cache? Return it, otherwise fetch online and put in cache
        return fetch(event.request).then(function (response) {
          console.log('Response from Apache ' + event.request.url)
          cache.put(event.request, response.clone())

          return response
        }) 
      })
    })
  )*/

})

