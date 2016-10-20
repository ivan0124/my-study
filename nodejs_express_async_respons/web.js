var express = require('express');
var ws_data = require('./wise_snail_data.js');
var app = express();

app.get('/', function (req, res) {
  res.send('show_all_vgw_map!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
