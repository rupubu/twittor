importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v4";
const DYNAMIC_CACHE = "dynamic-v2";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
  //   "/",
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js"
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js"
];

self.addEventListener("install", e => {
  const staticCache = caches
    .open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));
  const inmutableCache = caches
    .open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

  e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener("activate", e => {
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (
        key !== STATIC_CACHE &&
        key !== INMUTABLE_CACHE &&
        key !== DYNAMIC_CACHE
      ) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(respuesta);
});

self.addEventListener("fetch", e => {
  const respuesta = caches
    .match(e.request)
    .then(res =>
      res
        ? res
        : fetch(e.request).then(newRes =>
            actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
          )
    );
  e.respondWith(respuesta);
});
