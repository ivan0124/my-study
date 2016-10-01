
var mqtt = require('mqtt');
var client;//  = mqtt.connect('mqtt://test.mosquitto.org');

client.on('connect', function () {
  console.log('[wise_snail] mqtt connected');
  client.subscribe('agentinfo');
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  //client.end()
})

module.exports = {
  mqtt_connect: function() {
    client  = mqtt.connect('mqtt://test.mosquitto.org');
    console.log('[wise_snail] sayHelloInEnglish');
    return "HELLO";
  },
       
  sayHelloInSpanishx: function() {
    return "Hola";
  }
};
