class Bewertung {
    #blickrichtung;
    #windstaerke;
    #boeen;
    #windrichtung;
    #wettercode;
    #gruende = [];

    constructor(blickrichtung, windstaerke, boeen, windrichtung, wettercode) {
        this.#blickrichtung = blickrichtung;
        this.#windstaerke = windstaerke;
        this.#boeen = boeen;
        this.#windrichtung = windrichtung;
        this.#wettercode = wettercode;
    }

    #pruefeWindstaerke() {
        let farbe;

        if (this.#windstaerke < 12) {
            farbe = "rot";
            this.#gruende.push("Zu wenig Wind");
        } else if (this.#windstaerke < 25) {
            farbe = "gruen";
            this.#gruende.push("Guter Wind");
        } else if (this.#windstaerke < 30) {
            farbe = "gelb";
            this.#gruende.push("Viel Wind, nur für Erfahrene");
        } else {
            farbe = "rot";
            this.#gruende.push("Zu viel Wind");
        }

        if (this.#boeen >= 34) {
            farbe = "rot";
            this.#gruende.push("Sturmböen");
        } else if (this.#boeen >= 30) {
            this.#gruende.push("Starke Böen");
            if (farbe === "gruen") {
                farbe = "gelb";
            }
        }
        
        return farbe;
    }

    #pruefeWindrichtung() {
        let abweichung = Math.abs(this.#windrichtung - this.#blickrichtung);
        if (abweichung > 180) {
            abweichung = 360 - abweichung;
        }

        if (abweichung <= 45) {
            this.#gruende.push("Auflandiger Wind");
            return "gruen";
        } else if (abweichung <= 90) {
            this.#gruende.push("Seitlicher Wind, man kann abtreiben");
            return "gelb";
        } else {
            this.#gruende.push("Ablandiger Wind, Abdriftgefahr");
            return "rot";
        }
    }

    #pruefeWetter() {
        if ([95, 96, 99].includes(this.#wettercode)) {
            this.#gruende.push("Gewitter, Lebensgefahr auf dem Wasser!");
            return "rot";
        } else if ([45, 48].includes(this.#wettercode)) {
            this.#gruende.push("Nebel, eingeschränkte Sicht");
            return "gelb";
        } else {
            return "gruen";
        }
    }

    bewerten() {
        this.#gruende = [];

        const farben = [
            this.#pruefeWindstaerke(),
            this.#pruefeWindrichtung(),
            this.#pruefeWetter()
        ];

        let farbe;
        if (farben.includes("rot")) {
            farbe = "rot";
        } else if (farben.includes("gelb")) {
            farbe = "gelb";
        } else {
            farbe = "gruen";
        }

        return { farbe: farbe, gruende: this.#gruende };
    }


}