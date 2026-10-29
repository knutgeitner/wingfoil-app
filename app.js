console.log("app.js ist geladen");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
    console.log("Service Worker wird registriert");
}