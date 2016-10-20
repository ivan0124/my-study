// module1.js

var i=0;
var flag = 0;
var timerObj;

module.exports = {
  sayHelloInEnglish: function( query, callback) {
    
    i = 0;
    timerObj = setInterval(function () {
       
       if ( flag === 1 || i > 1 ){
         clearInterval(timerObj); 
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


