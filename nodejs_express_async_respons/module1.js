// module1.js

var i=0;
var flag = 0;
var timerObj;

var set = function( query, callback) {
    
  i = 0;
  //publish mqtt here  
  console.log(query);
    
  timerObj = setInterval(function () {
      
    if ( flag === 1 || i > 100 ){
      clearInterval(timerObj); 
      callback('callbak from module1. i = ' + i + ', flag = ' + flag);
    }
    else{
      console.log('wait... i = ' + i + ', flag = ' + flag);
    }   
     i++
     
  }, 500);
    
  return;
}

module.exports = {
  wsnset: set,  
}


