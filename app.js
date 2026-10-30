console.log("app.js ist geladen");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
    console.log("Service Worker wird registriert");
}

async function ladeSpots() {
    const antwort = await fetch("spots.json");
    const spots = await antwort.json();
    console.log(spots);

    const breiten = spots.map((spot) => spot.breitengrad).join(",");
    const laengen = spots.map((spot) => spot.laengengrad).join(",");

    const adresse = "https://api.open-meteo.com/v1/forecast"
        + "?latitude=" + breiten
        + "&longitude=" + laengen
        + "&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code"
        + "&wind_speed_unit=kn&timezone=Europe/Berlin";

    const wetterAntwort = await fetch(adresse);
    const wetterDaten = await wetterAntwort.json();

    spots.forEach((spot, nummer) => {
        const aktuell = wetterDaten[nummer].current;
        console.log(spot.name,
            "Wind:", aktuell.wind_speed_10m, "kn",
            "Böen:", aktuell.wind_gusts_10m, "kn",
            "Richtung:", aktuell.wind_direction_10m, "°",
            "Wettercode:", aktuell.weather_code);
    });

    const zeitpunkt = new Date(wetterDaten[0].current.time);
    
    const zeitText = zeitpunkt.toLocaleString("de-DE", {
        day: "2-digit", month: "long",
        hour: "2-digit", minute: "2-digit"
    });

    document.getElementById("aktualisierung").textContent =
        "Letzte Aktualisierung: " + zeitText + " Uhr"; 
} 

ladeSpots();