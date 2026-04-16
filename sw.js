const CACHE='pantanal-v1';
const FILES=[
  '/produccionpalma-app/gestion-agricola.html',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.url.includes('script.google.com')){
    return; // Las llamadas a Sheets siempre van a la red
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      return cached || fetch(e.request).then(res=>{
        return caches.open(CACHE).then(c=>{c.put(e.request,res.clone());return res;});
      }).catch(()=>cached);
    })
  );
});
