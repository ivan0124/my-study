// module1.js

var i=0;
var flag = 0;
var timerObj;
var setRunning = false ; 

var set = function( query, callback) {
    
  if ( setRunning === true ){
    callback('callbak from module1. set is Running, set fail');
    return;
  }
  
  setRunning = true;  
  i = 0;
  //publish mqtt here  
    
  timerObj = setInterval(function () {
      
    if ( flag === 1 || i > 100 ){
      clearInterval(timerObj); 
      callback('callbak from module1. set OK. i = ' + i + ', flag = ' + flag);
      setRunning = false;
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


