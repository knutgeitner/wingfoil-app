const CACHE_NAME = "wingfoil-v6";

const DATEIEN = [
    "./",
    "./index.html",
    "./style.css",
    "./manifest.json",
    "./ruegen.png",
    "./app.js",
    "./bewertung.js",
    "./spots.json",
    "./icon-192_wfa.png",
    "./icon-512_wfa.png"
];

self.addEventListener("install", (ereignis) => {
    console.log("Service Worker: lege Vorrat an");
    ereignis.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(DATEIEN))
    );
});

self.addEventListener("fetch", (ereignis) => {
    ereignis.respondWith(
        fetch(ereignis.request).catch(() => caches.match(ereignis.request))
    );
});