const ID = "742164bf-37b3-4b5b-a65d-a7d827316cb0";

const appShellFiles = [
    "/",
    "/index.html",
    "/assets/custom-font.woff",
    "/assets/custom-font.woff2",
    "/css/styles.css",
    "/js/app.js",
    "/js/store.js",
    "/js/view.js",
    "/meta/android-chrome-192x192.png",
    "/meta/android-chrome-512x512.png",
    "/meta/apple-touch-icon.png",
    "/meta/browserconfig.xml",
    "/meta/favicon-16x16.png",
    "/meta/favicon-32x32.png",
    "/meta/favicon.ico",
    "/meta/manifest.json",
    "/meta/mstile-150x150.png",
    "/meta/safari-pinned-tab.svg",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(ID);
            await cache.addAll(contentToCache);
        })()
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            const singleCache = await caches.match(event.request);
            if (singleCache) return singleCache;

            const response = await fetch(event.request);
            const cache = await caches.open(ID);

            cache.put(event.request, response.clone());
            return response;
        })()
    );
});