// module1.js
var mqtt = require('mqtt');
// module that has events
const EventEmitter = require('events');
// create EventEmitter object
var obj = new EventEmitter();

// export the EventEmitter object so others can use it

module.exports = {
  sayHelloInEnglish: function() {
    return "HELLO";
  },
       
  sayHelloInSpanish: function() {
    return "Hola";
  }
};

module.exports.eObj = obj;

var someData = 'this event test';
// other code in the module that does something to trigger events
// this is just one example using a timer
setInterval(function() {
    obj.emit("someEvent", someData);
}, 3000);

var client  = mqtt.connect('mqtt://172.22.214.60');
client.queueQoSZero = false;

var mqttConnectCallback =  function () {
  console.log('[module1.js] mqtt connect !!!!');
  client.subscribe('/cagent/admin/+/agentinfoack');
  client.subscribe('/cagent/admin/+/willmessage');
  client.subscribe('/cagent/admin/+/agentactionreq');
  client.subscribe('/cagent/admin/+/deviceinfo'); 
   
}

var mqttMessageCallback = function (topic, message){
  // message is Buffer 

  console.log('--------------------------------------------------------------');
  console.log('topic=' + topic.toString() );
  //console.log('msg=' + message.toString());
  obj.emit("someEvent", topic.toString());
  console.log('--------------------------------------------------------------');
}

client.on('connect', mqttConnectCallback );
client.on('message', mqttMessageCallback);
