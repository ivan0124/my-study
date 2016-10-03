//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var conn_map = new HashMap();
var vgw_map = new HashMap();
var sensor_hub_map = new HashMap();

client  = mqtt.connect('mqtt://127.0.0.1'); 

const msgType = { error: -1, unknown: 0,
                  vgw_connect: 1, vgw_os_info: 2, vgw_info_spec: 3, vgw_willmessage: 4,
                  vgw_disconnect: 5, vgw_info: 6,
                  sen_connect: 7, sen_disconnect: 8 };
var devObj = { connect: 'null', os_info: 'null', dev_info_spec: 'null',  dev_info: 'null'};


client.on('connect', function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  //client.subscribe('agentinfo');
  client.subscribe('/cagent/admin/+/agentinfoack');
  client.subscribe('/cagent/admin/+/willmessage');
  client.subscribe('/cagent/admin/+/agentactionreq');
  client.subscribe('/cagent/admin/+/deviceinfo'); 
   
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
          //copy devObj object as vgw objcect
          var vgw = JSON.parse(JSON.stringify(devObj));
          vgw.connect = message.toString();
          if ( vgw_map.has(device_id) === false ) {
              console.log('[' + device_id + ']' + ': create vgw_map');
              vgw_map.set(device_id, vgw );
          }
          break;
      }
    case msgType.vgw_os_info:
      {
          console.log('[' + device_id + ']' + ': vgw_os_info, IP=' + jsonObj.susiCommData.osInfo.IP);
          /*
          if ( is_ip_valid(jsonObj.susiCommData.osInfo.IP) === true ){
            console.log('[' + device_id + ']' + ': ip_base');
          }
          else{
            console.log('[' + device_id + ']' + ': none_ip_base');
          }
          */
          if ( vgw_map.has(device_id) === true ) {
                var vgw=vgw_map.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.os_info = message.toString();
                }
          }
          else{
               console.log('[msgType.vgw_os_info]: vgw_map does not exist !!');
          }
          
          break;
      }
    case msgType.vgw_info_spec:
      {
          console.log('[' + device_id + ']' + ': vgw_info_spec');
          if ( vgw_map.has(device_id) === true ) {
                var vgw=vgw_map.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info_spec = message.toString();
                  //add conn_map here
                    var infoObj=jsonObj.susiCommData.infoSpec.IoTGW.WSN;
                    for (key in infoObj) {
                         if (infoObj.hasOwnProperty(key)) {
                             //if ( typeof infoObj[key] === 'object' ){
                                 console.log('[key]:' +key + " =" + infoObj[key] + " ,type = " + Object.prototype.toString.call(infoObj));
                                 console.log('infoObj[bn]=====' + infoObj['bn']);
                                 //console.log(key + " G===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
                             //}
                         }
                     }                  
                    //var connObj = { vgw: 'null',  sensor_hub_list: {} };
                    //conn_map.set('123', connObj);
                }
          }
          else{
               console.log('[msgType.vgw_info_spec]: vgw_map does not exist !!');
          }        
          break;
      }
    case msgType.vgw_info:
      {
          console.log('[' + device_id + ']' + ': vgw_info');
          if ( vgw_map.has(device_id) === true ) {
                var vgw=vgw_map.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info = message.toString();
                }
          }
          else{
               console.log('[msgType.vgw_info]: vgw_map does not exist !!');
          }         
          break;
      }
    case msgType.vgw_disconnect:
      {
          console.log('[' + device_id + ']' + ': vgw_disconnect');
          if ( vgw_map.has(device_id) === true ) {
              console.log('[' + device_id + ']' + ': remove vgw_map');
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
    case msgType.sen_connect:
      {
          console.log('[' + device_id + ']' + ': sen_connect');
          //copy devObj object as vgw objcect
          /*
          var sen = JSON.parse(JSON.stringify(devObj));
          sen.connect = message.toString();
          if ( sensor_hub_map.has(device_id) === false ) {
              console.log('[' + device_id + ']' + ': create sensor_hub_map');
              sensor_hub_map.set(device_id, sen );
          } 
          */
          break;
      }
    case msgType.sen_disconnect:
      {
          console.log('[' + device_id + ']' + ': sen_disconnect');
          /*
          if ( sensor_hub_map.has(device_id) === true ) {
              console.log('[' + device_id + ']' + ': remove sensor_hub_map');
              //
              sensor_hub_map.remove(device_id);
          } 
          */
          break;
      }      
    case msgType.unknown:
      console.log('msgType.unknown');
      break;
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
        console.log('jsonObj.susiCommData.type =' + jsonObj.susiCommData.type + ',jsonObj.susiCommData.commCmd ='  + jsonObj.susiCommData.commCmd);
        if ( jsonObj.susiCommData.type === 'IoTGW' && 
             jsonObj.susiCommData.commCmd === 1 ){
             if ( jsonObj.susiCommData.status === 1){
                 return msgType.vgw_connect;
             }
             if ( jsonObj.susiCommData.status === 0){
                 return msgType.vgw_disconnect;
             }
        }
      
        if ( jsonObj.susiCommData.type === 'SenHub' && 
             jsonObj.susiCommData.commCmd === 1 ){
             if ( jsonObj.susiCommData.status === '1' || jsonObj.susiCommData.status === 1){
                 return msgType.sen_connect;
             }
             if ( jsonObj.susiCommData.status === '0' || jsonObj.susiCommData.status === 0){
                 return msgType.sen_disconnect;
             }
        }      
    }
  
    if ( topic_arr[4] === 'agentactionreq'){
        if ( jsonObj.susiCommData.commCmd === 116 ){
            return msgType.vgw_os_info;
        }
      
        if ( jsonObj.susiCommData.commCmd === 2052 ){
            if ( typeof jsonObj.susiCommData.infoSpec.IoTGW !== 'undefined' ){
                return msgType.vgw_info_spec;
            }  
        }       
    }
  
    if ( topic_arr[4] === 'deviceinfo'){   
        if ( jsonObj.susiCommData.commCmd === 2055 ){
            if ( typeof jsonObj.susiCommData.data.IoTGW !== 'undefined' ){
                return msgType.vgw_info;
            }  
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
  
  if (ip_arr[0] === 0 && ip_arr[1] === 0 &&
      ip_arr[2] === 0 && ip_arr[3] === 0){
      return false;
  }
  
  if ( (ip_arr[0] >= 0 && ip_arr[0] < 256) &&
       (ip_arr[1] >= 0 && ip_arr[1] < 256) &&
       (ip_arr[2] >= 0 && ip_arr[2] < 256) &&
       (ip_arr[3] >= 0 && ip_arr[3] < 256)){
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
  },
  
  show_all_vgw_map: function() {
    console.log('--------------------------------------------------------------');
    console.log('Show all vgw_map');
    vgw_map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
          console.log('['+key+']'+'[connect]' + ' : ' + obj.connect);
          console.log('['+key+']'+'[os_info]' + ' : ' + obj.os_info);
          console.log('['+key+']'+'[dev_info_spec]' + ' : ' + obj.dev_info_spec);
          console.log('['+key+']'+'[dev_info]' + ' : ' + obj.dev_info);
      }
    }); 
    console.log('--------------------------------------------------------------');
    console.log('Show all sensor_hub_map');
    sensor_hub_map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
          console.log('['+key+']'+'[connect]' + ' : ' + obj.connect);
          console.log('['+key+']'+'[os_info]' + ' : ' + obj.os_info);
          console.log('['+key+']'+'[dev_info_spec]' + ' : ' + obj.dev_info_spec);
          console.log('['+key+']'+'[dev_info]' + ' : ' + obj.dev_info);
      }
    });     
    console.log('--------------------------------------------------------------');
    return;
  }
};
