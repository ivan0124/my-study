var express = require('express');
var greetings = require("./greetings.js");
var app = express();

app.get('/', function (req, res) {
  // "Hello"
  greetings.sayHelloInEnglish();
  console.log('~~~~~~~~!!!!');
  // "Hola"  
  greetings.sayHelloInSpanish();  
  res.send('Hello World!');
});

app.get('/test', function (req, res) {  
  res.send('/test/Hello World!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
