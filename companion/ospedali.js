export function OspedaliAPI() {};

OspedaliAPI.prototype.getAllHospital = function (latitude, longitude) {
    return new Promise(function (resolve, reject) {
        let url = "https://codeps-mobile.azero.veneto.it/codePS";
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(res => {
                //Pulire i dati da tutti gli ospedali chiusi
                let ospedali = OspedaliAperti(res);
                //Ordina gli ospedali in base alla distanza
                ospedali = OrdinaOspedali(ospedali, latitude, longitude);

                resolve(ospedali);
            }).catch(error => {
                reject(error);
            });
    });
}

function OspedaliAperti(list) {
    console.log("Recuperati: " + list.length + " ospedali");

    let ospedaliAttivi = []
    for (let i = 0; i < list.length; i++) {
        if (list[i]["ATTIVO"] == "SI")
            ospedaliAttivi.push(list[i]);
    }
    console.log("Eliminati " + (list.length - ospedaliAttivi.length) + " ospedali non attivi");
    return ospedaliAttivi;
}

function OrdinaOspedali(ospedali, myLatitude, myLongitude) {
    for (let i = 0; i < ospedali.length; i++) {
        let hosLatitude = parseFloat(ospedali[i]["LATITUDINE"]);
        let hosLongitude = parseFloat(ospedali[i]["LONGITUDINE"]);
        let distanza = distanceInKmBetweenEarthCoordinates(myLatitude, myLongitude, hosLatitude, hosLongitude);
        ospedali[i]["distanzaDaMe"] = distanza;
    }

    ospedali.sort((a,b) => { return (a["distanzaDaMe"] - b["distanzaDaMe"]) });
    return ospedali;
}

//UTIL
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    let earthRadiusKm = 6371;

    let dLat = degreesToRadians(lat2 - lat1);
    let dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}