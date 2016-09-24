var express = require('express');
var greetings = require("./greetings.js");
var app = express();

app.get('/', function (req, res) {
  // "Hello"
  console.log(greetings.sayHelloInEnglish());
  // "Hola"  
  greetings.sayHelloInSpanish();  
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
