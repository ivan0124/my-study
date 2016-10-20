// module1.js

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    setInterval(function(callback) {
      callback('callbak from module1');
    }, 3000);    
    
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}


