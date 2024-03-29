// Guardar en cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  return res.ok
    ? caches.open(dynamicCache).then(cache => {
        cache.put(req, res.clone());
        return res.clone();
      })
    : res;
}
