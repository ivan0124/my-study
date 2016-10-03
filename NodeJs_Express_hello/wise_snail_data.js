//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var conn_map = new HashMap();

client  = mqtt.connect('mqtt://127.0.0.1'); 

var susiCmdType = { error: -1, vgw_connect: 1, vgw_os_info: 2, vgw_capability: 3 };


client.on('connect', function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  //client.subscribe('agentinfo');
  client.subscribe('/cagent/admin/+/agentinfoack');
   
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log('topic=' + topic.toString() + ',  msg=' + message.toString());
  
  getSusiCmdType(topic, message);
  /*
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
    ////var sensor1 = { cmd: topic.toString(), msg: message.toString() };
    ////sensor_hub_map.set('123', sensor1);
    //
    var co = {cap: 'null', sensor_hub: sensor_hub_map };
    ////var sen= co.sensor_hub.get('123');
    ////console.log('sen.cmd=' + sen.cmd + ', sen.msg=' + sen.msg );
    conn_map.set(key_id, co);    

  }
  //
  //client.end()
  */
})

function getSusiCmdType(topic, message){
  
    try {
        var jsonObj = JSON.parse(message.toString());
    } catch (e) {
        console.error(e);
        return susiCmdType.error;
    }
    
    console.log('jsonObj.susiCommData.type =' + jsonObj.susiCommData.type + ',jsonObj.susiCommData.commCmd ='  + jsonObj.susiCommData.commCmd);
    
    return susiCmdType.vgw_connect;
}

function get_id( topic ){
  console.log('[get_id] get topic id' );
  return 'key1';
}

module.exports = {
  set_connectivity: function() {
    console.log('[wise_snail_data] set_connectivity');
    var conn=conn_map.get('key1');
    if (typeof conn !== 'undefined') {
       var sensor1 = { cmd: 'xxxx_1', msg: 'yyyy_1' };
       conn.sensor_hub.set('123', sensor1);
       //
       var sensor2 = { cmd: 'xxxx_2', msg: 'yyyy_2' };
       conn.sensor_hub.set('456', sensor2);
    }    
    return;
  },
       
  get_connectivity: function() {
    console.log('[get_connectivity] conn_map.count() = ' + conn_map.count());
    var conn=conn_map.get('key1');
    if (typeof conn !== 'undefined') {
      
      conn.sensor_hub.forEach(function(obj, key) {
          if (typeof obj !== 'undefined') {
              console.log('key=' +  key + ', sen.cmd=' + obj.cmd + ', sen.msg=' + obj.msg );
          }
      });
      
    }
    return;
  }
};
