import * as messaging from "messaging";
import {
    geolocation
} from "geolocation";
import { OspedaliAPI } from "./ospedali.js"

let proxyUrl = "https://cors-anywhere.herokuapp.com/"
let baseUrl = "https://codeps-mobile.azero.veneto.it/codePS"

// Fetch the hospitals
function queryHospital() {
    fetch(baseUrl)
        .then(res => {
            return res.json()
        })
        .then(res => {
            //Pulire i dati da tutti gli ospedali chiusi
            res = OspedaliAperti(res);
            //Ordina gli ospedali e mi restituisce i 5 
            res = OrdinaOspedali(5);
            //console.log(res[0]);
        })
        .catch(function (err) {
            console.log("Error fetching hospital: " + err);
        });
}



//Send the weather data to the device
function returnHospitalData(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        //Send a command to the device
        messaging.peerSocket.send(data);
    } else {
        console.log("Error: Connection is not open");
    }
}

//recuperare posizione

geolocation.getCurrentPosition((position => {
    console.log(
        "Latitude: " + position.coords.latitude,
        "Longitude: " + position.coords.longitude
    );
}), (error) => {
    console.log("Error: " + error.code, "Message: " + error.message);
});

//Listen for messages from the device
messaging.peerSocket.onmessage = function (evt) {
    if (evt.data && evt.data.command == "hospitals") {
        //The device requested hospital list
        queryHospital();
    }
}

//Listen for the onerror event
messaging.peerSocket.onerror = function (err) {
    //Handle any errors
    console.log("Connection error: " + err.code + " - " + err.message);
}