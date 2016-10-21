// module1.js
var Mqtt = require('mqtt');
var Client  = Mqtt.connect('mqtt://172.22.214.60');
Client.queueQoSZero = false;
var mqttConnectCallback =  function () {

  console.log('[module1] Mqtt connect !!!!');
  Client.subscribe('/cagent/admin/+/agentinfoack');
  //Client.subscribe('/cagent/admin/+/willmessage');
  //Client.subscribe('/cagent/admin/+/agentactionreq');
  //Client.subscribe('/cagent/admin/+/deviceinfo'); 
   
}

var mqttMessageCallback = function (topic, message){
}


var i=0;
var flag = 0;
var timerObj;
var setRunning = false ;
var responseData;

var mqttConnectCallback =  function () {

  console.log('[module1] Mqtt connect !!!!');
  Client.subscribe('/cagent/admin/+/agentinfoack');
  //Client.subscribe('/cagent/admin/+/willmessage');
  //Client.subscribe('/cagent/admin/+/agentactionreq');
  //Client.subscribe('/cagent/admin/+/deviceinfo'); 
   
}

var mqttMessageCallback = function (topic, message){
  console.log('[module1] Mqtt message !!!!');
  responseData = message.toString();
  flag = 1;
}
 

var set = function( query, callback) {
    
  if ( setRunning === true ){
    callback('callbak from module1. set is Running, set fail');
    return;
  }
  
  setRunning = true;  
  i = 0;
  flag = 0;
  //publish mqtt here  
    
  timerObj = setInterval(function () {
      
    if ( flag === 1 || i > 100 ){
      clearInterval(timerObj); 
      callback('callbak from module1. set OK. i = ' + i + ', flag = ' + flag + ', responseData =\n' + responseData);
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

Client.on('connect', mqttConnectCallback );
Client.on('message', mqttMessageCallback);
