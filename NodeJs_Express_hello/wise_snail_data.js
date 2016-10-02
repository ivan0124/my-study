//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var conn_map = new HashMap();

client  = mqtt.connect('mqtt://127.0.0.1'); 

client.on('connect', function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  client.subscribe('agentinfo');
   
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log('topic=' + topic.toString() + ',  msg=' + message.toString());
  
  //
  var conn=conn_map.get('key1');
  if (typeof conn != 'undefined') {
    console.log('[wise_snail_data] conn key1 exist');
    var sen= conn.sensor_hub.get('123');
    console.log('sen.id=' + sen.cmd + ', sen.cap=' + sen.msg );
  }
  else{
    console.log('[wise_snail_data] conn key1 does nost exist');
    
    var sensor_hub_map = new HashMap();
    var sensor1 = { cmd: topic.toString(), msg: message.toString() };
    sensor_hub_map.set('123', sensor1);
    //
    var conn = {cap: 'null', sensor_hub: sensor_hub_map };
    var sen= conn.sensor_hub.get('123');
    console.log('sen.id=' + sen.cmd + ', sen.cap=' + sen.msg );
    conn_map.set('key1', conn);    

  }
  //
  //client.end()
  
})


module.exports = {
  set_connectivity: function() {
    console.log('[wise_snail_data] set_connectivity');
    return;
  },
       
  sayHelloInSpanishx: function() {
    return "Hola";
  }
};
