//Mqtt
var mqtt = require('mqtt');
//var client  = mqtt.connect('mqtt://test.mosquitto.org');
var client  = mqtt.connect('mqtt://1.2.3.4');
var mqtt_connected = false;

client.on('connect', function () {
  console.log('[WiseSnail] mqtt connect !!!!');
  client.subscribe('agentinfo');
  client.publish('agentinfo', 'Hello mqtt');
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  //client.end()
})

function connectMqtt(){
  
    console.log('mqtt status=' + client.connected + ',try to connect to mqtt...');
    setTimeout(connectMqtt, 3000); 
}

setTimeout(connectMqtt, 3000); 

module.exports = {
  set_connectivity: function() {
    console.log('[wise_snail] set_connectivity');
    return "HELLO";
  },
       
  sayHelloInSpanishx: function() {
    return "Hola";
  }
};
