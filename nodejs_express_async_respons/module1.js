// module1.js

var i=0;
var flag = 0;
var timerObj;

var set = function( query, callback) {
    
    i = 0;
    timerObj = setInterval(function () {
       
       if ( flag === 1 || i > 6 ){
         clearInterval(timerObj); 
         callback('callbak from module1. i = ' + i);
       }
       else{
         console.log('wait. i = ' + i);
       }
       
       i++
    }, 500);
    return;
  }

module.exports = {
  wsnset: set,
  /*
  wsnset: function( query, callback) {
    
    i = 0;
    timerObj = setInterval(function () {
       
       if ( flag === 1 || i > 6 ){
         clearInterval(timerObj); 
         callback('callbak from module1. i = ' + i);
       }
       else{
         console.log('wait. i = ' + i);
       }
       
       i++
    }, 500);
    return;
  },
  */     
}


