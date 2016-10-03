//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var conn_map = new HashMap();
var vgw_map = new HashMap();

client  = mqtt.connect('mqtt://127.0.0.1'); 

var msgType = { error: -1, unknown: 0,
                vgw_connect: 1, vgw_os_info: 2, vgw_capability: 3, vgw_willmessage: 4,
                vgw_disconnect:5 };
var vgwObj = { connect: 'null', os_info: 'null' };


client.on('connect', function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  //client.subscribe('agentinfo');
  client.subscribe('/cagent/admin/+/agentinfoack');
  client.subscribe('/cagent/admin/+/willmessage');
  client.subscribe('/cagent/admin/+/agentactionreq');
   
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log('--------------------------------------------------------------');
  console.log('topic=' + topic.toString() );
  console.log('msg=' + message.toString());
  
  try {
      var jsonObj = JSON.parse(message.toString());
  } catch (e) {
      console.error(e);
      return;
  }
  
  var msg_type = getMsgType(topic, jsonObj);
  var device_id = topic.toString().split('/')[3];
  
  
  switch(msg_type){
    case msgType.vgw_connect:
      {
          console.log('[' + device_id + ']' + ': vgw_connect');
          vgwObj.connect = message.toString();
          if ( vgw_map.has(device_id) === false ) {
              console.log('[' + device_id + ']' + ': create vgw_map');
              vgw_map.set(device_id, vgwObj );
          }
          break;
      }
    case msgType.vgw_os_info:
      {
          console.log('[' + device_id + ']' + ': vgw_os_info, IP=' + jsonObj.susiCommData.osInfo.IP);
          if ( is_ip_valid(jsonObj.susiCommData.osInfo.IP) === ture ){
            console.log('[' + device_id + ']' + ': ip_base');
          }
          else{
            console.log('[' + device_id + ']' + ': none_ip_base');
          }
          
          break;
      }
    case msgType.vgw_disconnect:
      {
          console.log('[' + device_id + ']' + ': vgw_disconnect');
          if ( vgw_map.has(device_id) === true ) {
              console.log('[' + device_id + ']' + ': remove vgw_map');
              //
              var vgw = vgw_map.get(device_id);
              if (typeof vgw != 'undefined') {
                  console.log('get vgw.connect='+vgw.connect);  
              }
              //
              vgw_map.remove(device_id);
          }
          break;        
      }
    case msgType.vgw_willmessage:
      {
          console.log('[' + device_id + ']' + ': vgw_willmessage');
          if ( vgw_map.has(device_id) === true ) {
              console.log('[' + device_id + ']' + ': remove vgw_map');
              vgw_map.remove(device_id);
          }
          break;
      }
    case msgType.unknown:
      console.log('msgType.unknown');
    default:
      console.log('default');
      break;
  }
  
  console.log('--------------------------------------------------------------');
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

function getMsgType(topic, jsonObj){
  
    var topic_arr = topic.toString().split('/');
    //console.log('=======> topic_arr[4] =' + topic_arr[4]);
  
    if ( topic_arr[4] === 'agentinfoack'){
        //console.log('jsonObj.susiCommData.type =' + jsonObj.susiCommData.type + ',jsonObj.susiCommData.commCmd ='  + jsonObj.susiCommData.commCmd);
        if ( jsonObj.susiCommData.type === 'IoTGW' && 
             jsonObj.susiCommData.commCmd === 1 ){
             if ( jsonObj.susiCommData.status === 1){
                 return msgType.vgw_connect;
             }
             if ( jsonObj.susiCommData.status === 0){
                 return msgType.vgw_disconnect;
             }
        }
    }
  
    if ( topic_arr[4] === 'agentactionreq'){
        if ( jsonObj.susiCommData.commCmd === 116 ){
            return msgType.vgw_os_info;
        }
    }
  
    if ( topic_arr[4] === 'willmessage'){
        return msgType.vgw_willmessage;
    }
    
    
    return msgType.unknown;
}

function is_ip_valid( ip ){
  
  var ip_arr=ip.split('.');
  //console.log( 'ip_arr.length = ' + ip_arr.length);
  if (ip_arr.length !== 4 ){
      return false;
  }
  
  if ( (ip_arr[0] > 0 && ip_arr[0] < 256) &&
       (ip_arr[1] > 0 && ip_arr[1] < 256) &&
       (ip_arr[2] > 0 && ip_arr[2] < 256) &&
       (ip_arr[3] > 0 && ip_arr[3] < 256)){
      return true;      
  }
  
  return false;
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
