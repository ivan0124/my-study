// module1.js

var CallBack
var callbackTimer = function(){
  CallBack('callbak from module1');
}

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    CallBack = callback;
    setInterval( callbackTimer(), 3000);    
    
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}


