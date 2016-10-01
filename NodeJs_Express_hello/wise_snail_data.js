//Mqtt
var mqtt = require('mqtt');
//var client  = mqtt.connect('mqtt://test.mosquitto.org');
client  = mqtt.connect('mqtt://127.0.0.1'); 

client.on('connect', function () {
  console.log('[WiseSnail] mqtt connect !!!!');
  client.subscribe('agentinfo');
   
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  //client.end()
})


module.exports = {
  set_connectivity: function() {
    console.log('[wise_snail] set_connectivity');
    client.publish('agentinfo', '[set_connectivity] Hello mqtt');
    return "HELLO";
  },
       
  sayHelloInSpanishx: function() {
    return "Hola";
  }
};
