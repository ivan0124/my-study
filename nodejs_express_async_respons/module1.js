// module1.js

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    callback('callbak from module1');
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}

setInterval(function() {
   
}, 3000);
