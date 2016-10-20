// module1.js

var i=0;
var flag = 0;

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    i = 0;
    setInterval(function () {
       
       if ( flag === 1 || i > 1 ){
         callback('callbak from module1. i = ' + i);
       }
       else{
         console.log('wait. i = ' + i);
       }
       
       i++
    }, 1000);
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
}


