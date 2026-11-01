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

    const zeichen = { gruen: "✓", gelb: "▲", rot: "✕"};
    const woerter = { gruen: "Grün", gelb: "Gelb", rot: "Rot"};
    spots.forEach((spot, nummer) => {
        const aktuell = wetterDaten[nummer].current;
        
        const bewertung = new Bewertung(
            spot.blickrichtung,
            aktuell.wind_speed_10m,
            aktuell.wind_gusts_10m,
            aktuell.wind_direction_10m,
            aktuell.weather_code
        );
        const ergebnis = bewertung.bewerten();

        document.getElementById("karte").innerHTML +=
            "<span class='symbol " + ergebnis.farbe + "' style='left: " + spot.bildX + "%; top: " + spot.bildY + "%;'>"
            + zeichen[ergebnis.farbe] + "</span>";
        
        let seite = "";
        if (spot.bildX > 75) {
            seite = " links";
        }    

        document.getElementById("karte").innerHTML +=
            "<span class='spotname " + ergebnis.farbe + seite + "' style='left: " + spot.bildX + "%; top: " + spot.bildY + "%;'>"
            + spot.name + "</span>";
            
        document.getElementById("kaertchen").innerHTML +=
            "<div class='spot " + ergebnis.farbe + "'>" + "<div class='kopf'>"
            + "<h2>" + spot.name + "</h2>"
            + "<span class='ampel " + ergebnis.farbe + "'>" + zeichen[ergebnis.farbe] + " "
            + woerter[ergebnis.farbe] + "</span>" + "</div>"
            + "<p class='gewaesser'>" + spot.gewaesser + "</p>" 
            + "<p class='wind'>Wind " + aktuell.wind_speed_10m + " kn · Böen " + aktuell.wind_gusts_10m + " kn · aus " 
            + aktuell.wind_direction_10m + "° " 
            + "<svg class='pfeil' viewBox='0 0 24 24' width='18' height='18' style='transform: rotate("
            + aktuell.wind_direction_10m + "deg);'>"
            + "<path d='m12 22 L5 10 H10 V2 H14 V10 H19 Z' fill='#0a4d68'/></svg></p>"
            + "<p class='gruende'>" + ergebnis.gruende.join(", ") + "</p>"  + "</div>";
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