var five = require("johnny-five");
var Raspi = require("raspi-io");
// Init board with raspberry pi
var board = new five.Board({io: new Raspi()});

var firebase = require('firebase');

var config = {
  apiKey: "<Key>",
  authDomain: "<domain>.firebaseapp.com",
  databaseURL: "https://<domain>.firebaseio.com",
  projectId: "<projectId>",
  storageBucket: "<domain>.appspot.com",
  messagingSenderId: "<id>"
};


firebase.initializeApp(config);

var database = firebase.database();

board.on("ready", function() {
  // We use two relays to open two doors
  var relay_v1 = new five.Relay("P1-12");
  var relay_v2 = new five.Relay("P1-7");
  // We read data from a path key on firebase
  database.ref().child('door').on('value', function(snapshot) {
    var value = snapshot.val();
    var v1 = value.door_1;
    var v2 = value.door_2;
    // Check value from each door
    // and open or close the circuit with the relay
    if (v1 == "closed") {
      relay_v1.off();
    } else {
      relay_v1.on();
    }
    if (v2 == "closed") {
      relay_v2.on();
    } else {
      relay_v2.off();
    }

  });
});
