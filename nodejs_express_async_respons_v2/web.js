var express = require('express');
var m1 = require('./module1.js');
var app = express();

app.get('/', function (req, res) {
  
  //console.log( 'm1.sayHelloInEnglish() = ' + m1.sayHelloInEnglish());
  m1.wsnset(res, function (myRes, data) {
    console.log( 'get callback return <======= ');
    myRes.send('data === ' + data);
  });
  //res.send('!');
});

app.put('/', function (req, res) {

  //console.log( 'm1.sayHelloInEnglish() = ' + m1.sayHelloInEnglish());
  m1.wsnset(res, function (myRes, data) {
    console.log( 'pug callback return <======= ');
    myRes.send('data === ' + data);
  });
  //res.send('!');
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
