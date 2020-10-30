const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/styles.css",
  "/db.js"
];
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install function
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("your files were succcessfully pre-cached");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    console.log("[Service Worker] Fetch(data)", event.request.url);
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        try {
          const response = await fetch(event.request);
          // If the response was good, clone it and store it in the cache.
          if (response.status === 200) {
            cache.put(event.request.url, response.clone());
          }
          return response;
        } catch (err) {
          return cache.match(event.request);
        }
      })
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      const response = await cache.match(event.request);
      return response || fetch(event.request);
    })
  );
});
// service workers are event driven
//uses cache(separate from the browser cache) and fetch API
//local host can be used to test serice workers
//pre cache assets during instillation --shared accross the application (application shell architecture)
//this does not preclude regular dynamic cacheing --precacheing and dynamic caching can be combined
//a second type of caching is to provide a full back for offline access. Using the fetch API we can
//use a fetch request and modify the response with content other than the content requested.
//service workers can also channel message, and host application API. Can use he PUSH API. BACKGROUND SYNC API

//Every Service worker goes through three steps in its life cycle: Registration, Instillation, and Activation
//The service worker needs to be registered in your main javascript code. Registration tells your browser where your service
// worker is, and to start installing it in the background.
//The service worker can be registered in a script tag in the entry point of the app or the server for example

/* 
if(!('serviceWorker' in navigator)) {
    console.log("SW not supported");
    return;
}
//service worker scope
navigator.serviceWorker.register('whereever the service worker is.js')
.then(function(registration){
    console.log('SW registered! Scope is: ', registration.scope);
});
// .catch a registration error
 */
// activation can
//install events self.stopWaiting()
//the install event is when you should prepair your service worker for use
// preadding the cache an adding assets to it
// a good time to clean up old caches and previous versions of your service worker

//the service worker to receive messages from other service workers through message events

//fuctional events such as fetch, push, and sync that the service worker can respond to.
//examine service workers in brower's dev tools)
