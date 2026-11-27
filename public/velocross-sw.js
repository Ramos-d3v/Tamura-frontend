const C = 'velocross-v2';
const PAGE = '/inscricao-velocross.html';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll([PAGE, '/velocross-icon-192.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('velocross-') === 0 && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  // Sempre tenta a versão mais nova do servidor; usa o cache só se estiver sem internet
  e.respondWith(
    fetch(e.request.url, { cache: 'no-store' })
      .then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(PAGE, cp)); return r; })
      .catch(() => caches.match(PAGE))
  );
});
