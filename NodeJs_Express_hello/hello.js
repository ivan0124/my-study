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

app.get('/sethash', function (req, res) { 
  
  var cat = {colour: "grey", name: "Spot", size: 46};
  console.log('cat.colour='+cat.colour);
  map.set("some_key", cat);
  
  res.send('/set/Hello World!');
});

app.get('/gethash', function (req, res) {
  
  var v=map.get("some_key"); // --> "some value"
  console.log('get v.colour~~~~~~~~!!!!'+v.colour);  
  res.send('/get/Hello World!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
