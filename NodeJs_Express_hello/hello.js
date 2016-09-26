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
  
  var cat1 = {colour: "red", name: "Spot1", size: 46};
  var cat2 = {colour: "blue", name: "Spot2", size: 36};
  var cat3 = {colour: "green", name: "Spot3", size: 26};
  //
  map.set("key1", cat1);
  map.set("key2", cat2);
  map.set("key3", cat3);
  
  res.send('/set/Hello World!');
});

app.get('/gethash', function (req, res) {
  
  var cat=map.get("key1");
  if (typeof cat != "undefined") {
      console.log('get cat.colour='+cat.colour);  
      cat.colour="gray";
  }
  //
  map.forEach(function(obj, key) {
      if (typeof obj != "undefined") {
          console.log(key + " : " + obj.colour);
      }
  });  
  res.send('/get/Hello World!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
