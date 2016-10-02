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
  var key_id=get_id( topic.toString());
  //
  console.log('[wise_snail_data] conn_map.count() = ' + conn_map.count());
  
  var conn=conn_map.get(key_id);
  console.log('[wise_snail_data] type conn = ' + typeof conn);
  
  if (typeof conn !== 'undefined') {
    console.log('[wise_snail_data] conn key1 exist');
    var sen= conn.sensor_hub.get('123');
    console.log('sen.cmd=' + sen.cmd + ', sen.msg=' + sen.msg );
    sen.msg = 'I change the msg';
    
  }
  else{
    console.log('[wise_snail_data] conn key1 does nost exist');
    
    var sensor_hub_map = new HashMap();
    var sensor1 = { cmd: topic.toString(), msg: message.toString() };
    sensor_hub_map.set('123', sensor1);
    //
    var co = {cap: 'null', sensor_hub: sensor_hub_map };
    var sen= co.sensor_hub.get('123');
    console.log('sen.id=' + sen.cmd + ', sen.cap=' + sen.msg );
    conn_map.set(key_id, co);    

  }
  //
  //client.end()
  
})

function get_id( topic ){
  console.log('[get_id] get topic id' );
  return 'key1';
}

module.exports = {
  set_connectivity: function() {
    console.log('[wise_snail_data] set_connectivity');
    var conn=conn_map.get('key1');
    if (typeof conn !== 'undefined') {
       var sensor1 = { cmd: 'xxxx', msg: 'yyyy' };
       conn_map.sensor_hub.set('456', sensor1);
    }    
    return;
  },
       
  get_connectivity: function() {
    var conn=conn_map.get('key1');
    if (typeof conn !== 'undefined') {
      /*
      var sen= conn.sensor_hub.get('123');
      if (typeof sen !== 'undefined') {
        console.log('[get_connectivity]sen.cmd=' + sen.cmd + ', sen.msg=' + sen.msg );
      }
      */
    }
    return;
  }
};
