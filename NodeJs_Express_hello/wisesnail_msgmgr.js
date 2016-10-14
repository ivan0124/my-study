//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var VgwMap = new HashMap();
var SensorHubMap = new HashMap();
var ConnectivityMap = new HashMap();

var client  = mqtt.connect('mqtt://172.22.214.60');
client.queueQoSZero = false;

const msgType = { error: -1, unknown: 0,
                  vgw_connect: 1, vgw_os_info: 2, vgw_info_spec: 3, vgw_willmessage: 4,
                  vgw_disconnect: 5, vgw_info: 6,
                  sen_connect: 7, sen_disconnect: 8, sen_info_spec: 9, sen_info: 10 };
const osType = { none_ip_base: 'none_ip_base', ip_base: 'ip_base'};
var devObj = { vgw_id: 'null', 
               conn_id: 'null',
               conn_type: 'null',
               connect: 'null', 
               os_info: 'null', 
               dev_info_spec: 'null',  
               dev_info: 'null'
             };

var mqttConnectCallback =  function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  client.subscribe('/cagent/admin/+/agentinfoack');
  client.subscribe('/cagent/admin/+/willmessage');
  client.subscribe('/cagent/admin/+/agentactionreq');
  client.subscribe('/cagent/admin/+/deviceinfo'); 
   
}

var mqttMessageCallback = function (topic, message){
  // message is Buffer 

  //console.log('--------------------------------------------------------------');
  //console.log('topic=' + topic.toString() );
  //console.log('msg=' + message.toString());

  try {
      var re = /\0/g;
      msg = message.toString().replace(re, '');
      var jsonObj = JSON.parse(msg);
  } catch (e) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error(e);
      return;
  }
  
  var msg_type = getMsgType(topic, jsonObj);
  var device_id = topic.toString().split('/')[3];
  
  
  switch(msg_type){
    case msgType.vgw_connect:
      {
          console.log('[' + device_id + ']' + ': vgw_connect');
         
          if ( VgwMap.has(device_id) === false ) {
              //copy devObj object as vgw objcect
              var vgw = JSON.parse(JSON.stringify(devObj));
          }
          else{
             var vgw = VgwMap.get(device_id);
          }
              
          vgw.connect = message.toString();            
          vgw.vgw_id = device_id.toString();
          VgwMap.set(device_id, vgw );        
          break;
      }
    case msgType.vgw_disconnect:
      {
          console.log('[' + device_id + ']' + ': vgw_disconnect');
          remove_vgw( device_id );
          break;        
      }      
    case msgType.vgw_os_info:
      {
          console.log('[' + device_id + ']' + ': vgw_os_info, IP=' + jsonObj.susiCommData.osInfo.IP);
          if ( VgwMap.has(device_id) === true ) {
                var vgw=VgwMap.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.os_info = message.toString();
                }
          }
          else{
               console.log('[msgType.vgw_os_info]: VgwMap does not exist !!');
          }
          
          break;
      }
    case msgType.vgw_info_spec:
      {
          console.log('[' + device_id + ']' + ': vgw_info_spec');
          if ( VgwMap.has(device_id) === true ) {
                var vgw = VgwMap.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info_spec = message.toString();
                  //add ConnectivityMap here
                    var infoObj=jsonObj.susiCommData.infoSpec.IoTGW;
                    //console.log( '[ConnectivityMapUpdate] Start-------------------------------------------------');
                    connectivityMapUpdate(msgType.vgw_info_spec, device_id , vgw.os_info, 0, 'null', infoObj); 
                    //console.log( '[ConnectivityMapUpdate] End---------------------------------------------------');                  
                }
          }
          else{
               console.log('[msgType.vgw_info_spec]: VgwMap does not exist !!');
          }        
          break;
      }
    case msgType.vgw_info:
      {
          console.log('[' + device_id + ']' + ': vgw_info');
          if ( VgwMap.has(device_id) === true ) {
                var vgw=VgwMap.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info = message.toString();
                  var infoObj=jsonObj.susiCommData.data.IoTGW;
                  //console.log( '[ConnectivityMapUpdate] Start-------------------------------------------------');
                  connectivityMapUpdate(msgType.vgw_info, device_id , vgw.os_info, 0, 'null', infoObj); 
                  //console.log( '[ConnectivityMapUpdate] End---------------------------------------------------');   
                }
          }
          else{
               console.log('[msgType.vgw_info]: VgwMap does not exist !!');
          }         
          break;
      }
    case msgType.vgw_willmessage:
      {
          console.log('[' + device_id + ']' + ': vgw_willmessage');
          remove_vgw( device_id );
          break;
      }
    case msgType.sen_connect:
      {
          console.log('[' + device_id + ']' + ': sen_connect');
          sensorHubMapUpdate(msgType.sen_connect, device_id, message.toString());
          break;
      }
    case msgType.sen_disconnect:
      {
          console.log('[' + device_id + ']' + ': sen_disconnect');
      }
    case msgType.sen_info_spec:
      {
         console.log('[' + device_id + ']' + ': sen_info_spec');
         sensorHubMapUpdate(msgType.sen_info_spec, device_id, message.toString());
         break;
      }
    case msgType.sen_info:
      {    
        console.log('[' + device_id + ']' + ': sen_info');
        sensorHubMapUpdate(msgType.sen_info, device_id, message.toString());
        break;
      }
    case msgType.unknown:
      console.log('msgType.unknown');
      break;
    default:
      console.log('default');
      break;
  }
  //console.log('--------------------------------------------------------------');  
}

function getObjKeyValue( jsonObj, outObj){
  //console.log( 'listObj Start-------------------------------------------------');
  //outObj.layer++;
  for (key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
          if ( outObj.is_n_sv_format === true ){
            if ( jsonObj[key] === outObj.key ){
              //console.log( 'key =======>' + key + ', keyVal=======>' + jsonObj[key]);
              //console.log( 'key =======>' + 'sv' + ', keyVal=======>' + jsonObj['sv']);     
              if ( typeof jsonObj['sv'] === 'object'){ 
                outObj.result = JSON.stringify(jsonObj['sv']);
              }
              else{
                outObj.result = jsonObj['sv'];
              }
              return;
            }
          }
          else {
            if ( key === outObj.key ){
              //console.log( 'key =======>' + key + ', keyVal=======>' + jsonObj[key]);
              if ( typeof jsonObj[key] === 'object'){ 
                outObj.result = JSON.stringify(jsonObj[key]);
              }
              else{
                outObj.result = jsonObj[key];
              }
              return;
            }
          }
      }
   }
 //
  for (key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
          //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
          if (typeof jsonObj[key] === 'object' ){
              getObjKeyValue( jsonObj[key], outObj);
          }
      }
   }
   //outObj.layer--;
   //console.log( 'listObj return -------------------------------------------------key=' + key);
   return;  
}

function connectivityMapUpdate( messageType, vgw_id, osInfo, layer, connType, infoObj){
  
  //console.log( 'Start-------------------------------------------------');
  layer++;
  for (key in infoObj) {
      if (infoObj.hasOwnProperty(key)) {
          //console.log('layer=' + layer + 'key =====================' + key);
          if ( key === 'bn' ){
              if ( layer === 2 ){
                connType = infoObj[key];
                //console.log('layer=' + layer + 'connType =====================' + connType);
              }
              if ( layer === 3 ){
                 //console.log( 'messageType =' + messageType + ', [layer] :' + layer + ', connType='+ connType +', infoObj[' + key +']=======>' + infoObj[key] );
                 var device_id=infoObj[key];
                 if ( ConnectivityMap.has(device_id) === false ) {
                   //copy devObj object as vgw objcect
                   var connectivity = JSON.parse(JSON.stringify(devObj));
                 }
                 else{
                   var connectivity = ConnectivityMap.get(device_id);
                 }
                
                 if ( messageType === msgType.vgw_info_spec ){ 
                   connectivity.vgw_id = vgw_id;
                   connectivity.os_info = osInfo;
                   connectivity.conn_id = device_id; 
                   connectivity.conn_type = connType;
                   connectivity.dev_info_spec = JSON.stringify(infoObj['Info']);
                 }
                   
                 if ( messageType === msgType.vgw_info ){
                   /*
                   var tmpInfoObj = infoObj['Info'];
                   var tmpInfoSpecObj = JSON.parse(JSON.parse(connectivity.dev_info_spec));
                   var outObj = {
                                  key:'SenHubList',
                                  is_n_sv_format: true, 
                                  result:''
                                 };
                   //getObjKeyValue(infoObj, outObj);
                   */
                   var tmpInfoSpecObj = JSON.parse(JSON.parse(connectivity.dev_info_spec));
                   for ( var i=0 ; i < infoObj['Info']['e'].length ; i++){
                     //infoObj['Info']['e'][i].asm = 'r';//tmpInfoSpecObj['e'][i].asm;
                     console.log('infoObj.Info.e['+ i +'] = ' +  JSON.stringify(infoObj['Info']['e'][i]));
                   }
                   connectivity.dev_info = JSON.stringify(infoObj['Info']);
                 }
                 //console.log('[' + device_id + ']' + ': update ConnectivityMap key pairs');
                 ConnectivityMap.set(device_id, connectivity );                
                 return;
              }
               
          }
      }
   }
 //
  for (key in infoObj) {
      if (infoObj.hasOwnProperty(key)) {
          //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
          if (typeof infoObj[key] === 'object' ){
              connectivityMapUpdate(messageType, vgw_id, osInfo, layer, connType, infoObj[key]);
          }
      }
   }  
  
   layer--;
   return;    
}


function sensorHubMapUpdate(messageType, device_id, message){
          
  //console.log('message ===== ' + message);
  ConnectivityMap.forEach(function(obj, key) {
    //console.log('obj.dev_info = ' + obj.dev_info);
    var infoObj = JSON.parse ( obj.dev_info );
    var outObj = {
                  key:'SenHubList',
                  is_n_sv_format: true, 
                  result:''
                 };
    getObjKeyValue(infoObj, outObj);
    var sensorHubList = outObj.result.split(',');
    for (var i=0 ; i < sensorHubList.length ; i++){
      if(sensorHubList[i] === device_id){
        //console.log('sensorHub(' + device_id + '): conn_id=' + obj.conn_id + ', vgw_id=' + obj.vgw_id  );
        if ( SensorHubMap.has(device_id) === false ) {
          var sensorhub = JSON.parse(JSON.stringify(devObj));
        }
        else{
          var sensorhub = SensorHubMap.get(device_id);
        }
        sensorhub.vgw_id = obj.vgw_id;
        sensorhub.os_info = obj.os_info;
        sensorhub.conn_id = obj.conn_id;
        sensorhub.conn_type = obj.conn_type;
        if ( msgType.sen_connect === messageType){
          sensorhub.connect = message;
        }
        if ( msgType.sen_info_spec === messageType){
          sensorhub.dev_info_spec = message;
        }        
        if ( msgType.sen_info === messageType){
          sensorhub.dev_info = message;
        }            
        
        SensorHubMap.set(device_id, sensorhub );        
        return;
      }
    }
  });
               
}


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
          
            if ( typeof jsonObj.susiCommData.infoSpec.SenHub !== 'undefined' ){
                return msgType.sen_info_spec;
            }  
        }       
    }
  
    if ( topic_arr[4] === 'deviceinfo'){   
        if ( jsonObj.susiCommData.commCmd === 2055 ){
            if ( typeof jsonObj.susiCommData.data.IoTGW !== 'undefined' ){
                return msgType.vgw_info;
            }  
          
            if ( typeof jsonObj.susiCommData.data.SenHub !== 'undefined' ){
                return msgType.sen_info;
            }          
          
        }       
    }  
  
    if ( topic_arr[4] === 'willmessage'){
        return msgType.vgw_willmessage;
    }
    
    
    return msgType.unknown;
}

function getStatusFromMsg( connectMsg ){
  
  //console.log('connectMsg = ' + connectMsg);
  try {
      var msgObj = JSON.parse(connectMsg.toString());
      var status = msgObj.susiCommData.status;
      if ( status === 1 || status === '1' ){
        return 'on';
      }    
  } catch (e) {
      return 'off';
  }   
  
  return 'off';
}


function getOSType( vgw_id ){

  console.log('[getOSType]vgw_id=' + vgw_id);
  if ( VgwMap.has(vgw_id) === false ) {
    console.log('[getOSType] VgwMap.has(vgw_id) === false');
    return 'null';
  }
    
  var vgw=VgwMap.get(vgw_id);
  if (typeof vgw === 'undefined') {
    console.log('[getOSType] VgwMap.has(vgw_id) === false');
    return 'null';                 
  }
  
  try {
      var os_info_obj = JSON.parse(vgw.os_info);
  } catch (e) {
      console.error(e);
      return 'null';
  }  
  
  if ( is_ip_valid( os_info_obj.susiCommData.osInfo.IP) === true ){
    console.log('[' + vgw_id + ']' + ': ' + osType.ip_base);
    return osType.ip_base;
  }
  else{
    console.log('[' + vgw_id + ']' + ':' + osType.none_ip_base);
    return osType.none_ip_base;
  }  
  
  return 'null';
  
}

function remove_vgw( vgw_id ){

    console.log('--------------------------------------------------------------');
  
    console.log('Show all VgwMap. count= ' + VgwMap.count());
    VgwMap.forEach(function(obj, key) {
      console.log('key = ' + key); 
      if ( vgw_id === key ){
        console.log('VgwMap.remove() key = ' + key);
        VgwMap.remove(key);
      }
    });     
    console.log('Show all VgwMap. count= ' + VgwMap.count());
    console.log('--------------------------------------------------------------');    
    console.log('Show all ConnectivityMap. count= ' + ConnectivityMap.count());
    ConnectivityMap.forEach(function(obj, key) {
      console.log('key = ' + key); 
      if ( vgw_id === obj.vgw_id ){
         console.log('ConnectivityMap.remove() key = ' + key);
        /*
         console.log('----');
         console.log('vgw_id = ' + obj.vgw_id);
         console.log('conn_id = ' + obj.conn_id);
         console.log('conn_type = ' + obj.conn_type);
         console.log('os info = \n' + obj.os_info);
         console.log('conn dev_info_spec = \n' + obj.dev_info_spec);
         console.log('conn dev_info = \n' + obj.dev_info);
         //console.log('conn_type = ' + obj.conn_type);
         console.log('----');
         */
         ConnectivityMap.remove(key);
      }
    });     
    console.log('Show all ConnectivityMap. count= ' + ConnectivityMap.count());
    console.log('--------------------------------------------------------------');
    console.log('Show all SensorHubMap. count= ' + SensorHubMap.count());
    SensorHubMap.forEach(function(obj, key) {
      console.log('key = ' + key); 
      if ( vgw_id === obj.vgw_id ){
         console.log('SensorHubMap.remove() key = ' + key);
        /*
         console.log('----');
         console.log('vgw_id = ' + obj.vgw_id);
         console.log('conn_id = ' + obj.conn_id);
         console.log('conn_type = ' + obj.conn_type);
         console.log('os info = \n' + obj.os_info);
         console.log('sensorhub connect = \n' + obj.connect);
         console.log('sensorhub dev_info_spec = \n' + obj.dev_info_spec);
         console.log('sensorhub dev_info = \n' + obj.dev_info);
         //console.log('conn_type = ' + obj.conn_type);
         console.log('----');
         */
         SensorHubMap.remove(key);
      }
    });     
    console.log('Show all SensorHubMap. count= ' + SensorHubMap.count());
    console.log('--------------------------------------------------------------');  
  
}

function is_ip_valid( ip ){
  
  console.log( '[is_ip_valid] ip = ' + ip);
  var ip_arr=ip.split('.');
  console.log( 'ip_arr.length = ' + ip_arr.length);
  if (ip_arr.length !== 4 ){
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
  test: function() {
    console.log('[wise_snail_data] test');
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
  
  show_all_VgwMap: function() {
    /*
    console.log('--------------------------------------------------------------');
    console.log('Show all VgwMap');
    VgwMap.forEach(function(obj, key) {
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
    */
    console.log('--------------------------------------------------------------');
    console.log('Show all conn_map. count= ' + conn_map.count());
    //console.log('getStatusFromMsg=' + getStatusFromMsg(''));
    var tmp_vgw_id='';
    conn_map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
          if ( tmp_vgw_id !== obj.vgw_id){
            console.log('(VGW):'+obj.vgw_id );
            tmp_vgw_id = obj.vgw_id;
          }
          console.log(' |-(Connectivity)('+ obj.os_type +'):' + key );
          obj.sensor_hub_list.forEach(function(senObj, senKey){
             if (typeof senObj !== 'undefined'){
               var status= getStatusFromMsg( senObj.connect );
               console.log('    |--(SensorHub)('+ status + '):' + senKey);
             }
          });
      }
    });     
    console.log('--------------------------------------------------------------');    
    return;
  }
};

client.on('connect', mqttConnectCallback );
client.on('message', mqttMessageCallback);


