const ID = "7e72106asb-f4ac-472e-98be-ef9cab03f2e4";

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
            .then((cache) => cache.addAll(FILES)
        )
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        console.log(event);
  
        return fetch(event.request)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            throw error;
          });
      })
    );
  });