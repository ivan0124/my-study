var express = require('express');
var app = express();
var m1 = require('./module1.js');

m1.eObj.on("someEvent", function(data) {
    // process data when someEvent occurs
  console.log('[RECEIVE] someEvent data = ' + data);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
