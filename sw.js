const ID = "74aasddddsd21316cb0";

const FILES = [
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
    console.log(event)
    event.waitUntil(
        caches
            .open(ID)
            .then((cache) =>cache.addAll(FILES)
        )
    );
});

self.addEventListener("fetch", (event) => {
    console.log(event)
    event.respondWith(caches.match(event.request));
});