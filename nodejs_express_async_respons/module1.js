// module1.js
/*
var CallBack
var callbackTimer = function(){
  callback('callbak from module1');
}
*/

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    callback('callbak from module1');
    /*
    CallBack = callback;
    setInterval( callbackTimer(), 3000);    
    */
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}


