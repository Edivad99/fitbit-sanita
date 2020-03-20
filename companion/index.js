import * as messaging from "messaging";
import {
    geolocation
} from "geolocation";
import {
    OspedaliAPI
} from "./ospedali.js"


//Send the hospital data to the device
function queryHospital() {
    let ospedaliAPI = new OspedaliAPI();

    geolocation.getCurrentPosition((position => { 
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        console.log(
            "Latitude: " + position.coords.latitude,
            "Longitude: " + position.coords.longitude
        );
        ospedaliAPI.getAllHospital(latitude, longitude).then(ospedali => {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                console.log(ospedali.length);
                //messaging.peerSocket.send(ospedali);
            }
        }).catch(e => {
            console.log("error");
            console.log(e);
        });
    }));
}

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