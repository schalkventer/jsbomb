const ID = "BUST_CACHE";

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
    console.log(`Handling fetch event for ${event.request.url}`);
  
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log("Found response in cache:", response);
          return response;
        }
        console.log("No response found in cache. About to fetch from network…");
  
        return fetch(event.request)
          .then((response) => {
            console.log("Response from network is:", response);
  
            return response;
          })
          .catch((error) => {
            console.error(`Fetching failed: ${error}`);
            throw error;
          });
      })
    );
  });