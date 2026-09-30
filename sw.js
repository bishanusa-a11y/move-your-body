// Move Your Body (hosted build): the app shell is cached so it opens with no connection at all,
// but every open re-checks the server so a new version shows straight away.
const SHELL = "myb-hosted-v23";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon2-192.png", "./icon2-512.png", "./exercises.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SHELL).then(c => Promise.allSettled(ASSETS.map(a => c.add(new Request(a, { cache: "reload" }))))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return;
  // "no-cache" makes the browser ask the server whether the page changed instead of trusting its own copy.
  e.respondWith(fetch(new Request(e.request, { cache: "no-cache" })).then(r => { if (r && r.ok) { const copy = r.clone(); caches.open(SHELL).then(c => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match("./index.html"))));
});
