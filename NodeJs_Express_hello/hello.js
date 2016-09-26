var express = require('express');
var greetings = require("./greetings.js");
var HashMap = require('hashmap').HashMap;
var map = new HashMap();
var app = express();

app.get('/', function (req, res) {
  // "Hello"
  greetings.sayHelloInEnglish();
  console.log('~~~~~~~~!!!!');
  // "Hola"  
  greetings.sayHelloInSpanish();  
  res.send('Hello World!');
});

app.get('/get', function (req, res) { 
  map.set("some_key", "some value");
  var v=map.get("some_key"); // --> "some value"
  console.log('get ~~~~~~~~!!!!'+v);
  res.send('/get/Hello World!');
});

app.get('/set', function (req, res) {
  console.log('set ~~~~~~~~!!!!');
  res.send('/set/Hello World!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
