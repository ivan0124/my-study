//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;

client  = mqtt.connect('mqtt://127.0.0.1'); 

client.on('connect', function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  client.subscribe('agentinfo');
   
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log('topic=' + topic.toString() + 'msg=' + message.toString());
  
  /*
  var sensor_hub_map = new HashMap();
  var sensor1 = {id: topic.toString(), cap: message.toString() };
  sensor_hub_map.set('123', sensor1);
  //
  var conn = {cap: 'null', sensor_hub: sensor_hub_map };
  var sen= conn.sensor_hub.get('123');
  console.log('sen.id=' + tmp_sen.id + ', sen.cap=' + tmp_sen.cap );
  //client.end()
  */
})


function s


module.exports = {
  set_connectivity: function() {
    console.log('[wise_snail_data] set_connectivity');
    return;
  },
       
  sayHelloInSpanishx: function() {
    return "Hola";
  }
};
