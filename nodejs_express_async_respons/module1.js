// module1.js

var callbackTimer = function(callback){
  callback('callbak from module1');
}

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    setInterval( callbackTimer(callback), 3000);    
    
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}


