// module1.js
var Mqtt = require('mqtt');
var Client  = Mqtt.connect('mqtt://172.22.214.60');
var Uuid = require('node-uuid');
var HashMap = require('hashmap').HashMap;
var MqttPublishMap = new HashMap();

Client.queueQoSZero = false;



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
  Client.subscribe('/cagent/admin/+/agentactionreq');
  //Client.subscribe('/cagent/admin/+/deviceinfo'); 
   
}

var mqttMessageCallback = function (topic, message){
  console.log('[module1] Mqtt message !!!!');
  responseData = message.toString();
  console.log('-----------------------------------------------------');
  console.log(message.toString());
  console.log('-----------------------------------------------------');

  if ( typeof myCallback !== 'undefined' && typeof myRes !== 'undefined' && myCallback !== 'null' && myRes !== 'null'){
    myCallback(myRes, 'callbak from module1. set OK. i = ' + i + ', flag = ' + flag + ', responseData =\n' + responseData);
    myCallback = 'null';
    myRes = 'null';
  }
}
 

var set = function( res, callback) {
    
  myRes = res;
  myCallback = callback;
/*
  //Sensor Hub Set
  var message = '{\"susiCommData\":{\"sensorIDList\":{\"e\":[{\"sv\":\"SenHub1\",\"n\":\"SenHub/Info/Name\"}]},\
                  \"sessionID\":\"4DDF0B6DE2773176095F55E8C930507A\",\"commCmd\":525,\"requestID\":0,\
                  \"agentID\":\"\",\"handlerName\":\"SenHub\",\"sendTS\":1466088605}}';
  console.log('publish 0017000E40000000 ===========================>');
  Client.publish('/cagent/admin/0017000E40000000/agentcallbackreq', message);
*/

  //Connectivity Set (use Virtual Gateway ID)
  //Sensor Hub Set
  var message = '{\"susiCommData\":{\"sensorIDList\":{\"e\":[{\"bv\":0,\"n\":\"IoTGW/WSN/0007000E40ABCDEF/Info/reset\"}]},\
                  \"sessionID\":\"26366CCF4E34D0E69FA9480B460C35D3\",\"commCmd\":525,\"requestID\":0,\"agentID\":\"\",\
                  \"handlerName\":\"IoTGW\",\"sendTS\":1477021205}}';
  /* response data
{"susiCommData":{"commCmd":526,"handlerName":"IoTGW","sessionID":"26366CCF4E34D0E69FA9480B460C35D3","sensorInfoList":{"e":[{"n":"/Info/reset","sv":"Success","StatusCode":200}]}}}
  */
  var sessionID = Uuid.v4().replace(/-/g,'');
  console.log('session ID ===' + sessionID );
  
  var pubObj = {};
  pubObj.res = res;
  pubObj.callback = callback;
  MqttPublishMap.set(sessionID, pubObj);
  
  setTimeout(function () {
    console.log('timer session ID ===' + sessionID );
    if ( MqttPublishMap.has(sessionID) === true){
      var pubObj = MqttPublishMap.get(sessionID);
      if ( typeof pubObj !== 'undefined' ){
        pubObj.callback(pubObj.res, 'callbak from module1. set fail.');
        MqttPublishMap.remove(sessionID);
        console.log(' MqttPublishMap.count() =' + MqttPublishMap.count())
      }
    //myCallback(myRes, 'callbak from module1. set fail.');
    //myCallback = 'null';
    //myRes = 'null';
    }
  } , 60000, sessionID);
  
  console.log('publish to 0000000E40ABCDEF ===========================>');
  Client.publish('/cagent/admin/0000000E40ABCDEF/agentcallbackreq', message);

  return;
}

module.exports = {
  wsnset: set,  
}

Client.on('connect', mqttConnectCallback );
Client.on('message', mqttMessageCallback);
