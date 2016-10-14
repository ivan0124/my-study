var EVENT = require('./wisesnail_event.js');
var express = require('express');
var app = express();
var m1 = require('./module1.js');

m1.eObj.on(EVENT.eConnectivity_Capability, function(data) {
    // process data when someEvent occurs
  console.log('[RECEIVE] EVENT.eConnectivity_Capability, data = ' + data);
});

m1.eObj.on(EVENT.eConnectivity_UpdateData , function(data) {
    // process data when someEvent occurs
  console.log('EVENT.eConnectivity_UpdateData, data = ' + data);
});

app.get('/', function (req, res) {
  //m1.sayHelloInEnglish();
  console.log('sayHelloInEnglish() return = ' + m1.sayHelloInEnglish());
  res.send('sayHelloInEnglish!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
