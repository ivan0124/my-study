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
var myRes;
var myCallback;

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

  if ( myCallback !== 'null' && myRes !== 'null'){
    myCallback(myRes, 'callbak from module1. set OK. i = ' + i + ', flag = ' + flag + ', responseData =\n' + responseData);
    myCallback = 'null';
    myRes = 'null';
  }
}
 

var set = function( res, callback) {
    
  myRes = res;
  myCallback = callback;

  return;
}

module.exports = {
  wsnset: set,  
}

Client.on('connect', mqttConnectCallback );
Client.on('message', mqttMessageCallback);
