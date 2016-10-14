// module1.js
// module that has events
const EventEmitter = require('events');
// create EventEmitter object
var obj = new EventEmitter();

// export the EventEmitter object so others can use it

module.exports = {
  sayHelloInEnglish: function() {
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
};

module.exports.eObj = obj;

var someData = 'this event test';
// other code in the module that does something to trigger events
// this is just one example using a timer
setInterval(function() {
    obj.emit("someEvent", someData);
}, 3000);
