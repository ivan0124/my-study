// module1.js

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    setTimeout(function () {
       callback('callbak from module1');
    }, 3000);
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}


