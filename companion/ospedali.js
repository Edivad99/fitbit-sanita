export function OspedaliAPI() {};

BartAPI.prototype.getAllHospital = function (origin, direction) {
    return new Promise(function (resolve, reject) {
        let url = "https://codeps-mobile.azero.veneto.it/codePS";
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (res) {
            //console.log("Got JSON response from server:" + JSON.stringify(json));

            //Pulire i dati da tutti gli ospedali chiusi
            ospedali = OspedaliAperti(res);
            //Ordina gli ospedali e mi restituisce i 5 
            //res = OrdinaOspedali(5);

            resolve(ospedali);
        }).catch(function (error) {
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