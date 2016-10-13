//Mqtt
var mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var conn_map = new HashMap();
var vgw_map = new HashMap();
var sensor_hub_map = new HashMap();

//
var sensorHubMap = new HashMap();
var connectivityMap = new HashMap();

var client  = mqtt.connect('mqtt://127.0.0.1');
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


client.on('connect', function () {
  console.log('[wise_snail_data] mqtt connect !!!!');
  client.subscribe('/cagent/admin/+/agentinfoack');
  client.subscribe('/cagent/admin/+/willmessage');
  client.subscribe('/cagent/admin/+/agentactionreq');
  client.subscribe('/cagent/admin/+/deviceinfo'); 
   
})
 
client.on('message', function (topic, message) {
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
         
          if ( vgw_map.has(device_id) === false ) {
              //copy devObj object as vgw objcect
              var vgw = JSON.parse(JSON.stringify(devObj));
              vgw.connect = message.toString();            
              console.log('[' + device_id + ']' + ': add vgw_map key pairs');
              vgw.vgw_id = device_id.toString();
              vgw_map.set(device_id, vgw );
          }
          else{
             var vgw = vgw_map.get(device_id);
             if ( vgw !== 'undefined'){
               vgw.connect = message.toString(); 
               console.log('[' + device_id + ']' + ': update vgw_map');
             }
          }
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
                console.log('****** =====================================>');
                var vgw = vgw_map.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info_spec = message.toString();
                  //add connectivityMap here
                    var infoObj=jsonObj.susiCommData.infoSpec.IoTGW;
                    console.log( '[connectivityMapUpdate] Start-------------------------------------------------');
                    connectivityMapUpdate(msgType.vgw_info_spec, device_id , vgw.os_info, 0, 'null', infoObj); 
                    console.log( '[connectivityMapUpdate] End---------------------------------------------------');                  
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
                  var infoObj=jsonObj.susiCommData.data.IoTGW;
                  console.log( '[connectivityMapUpdate] Start-------------------------------------------------');
                  connectivityMapUpdate(msgType.vgw_info, device_id , vgw.os_info, 0, 'null', infoObj); 
                  console.log( '[connectivityMapUpdate] End---------------------------------------------------');   
                }
          }
          else{
               console.log('[msgType.vgw_info]: vgw_map does not exist !!');
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
          //console.log('[' + device_id + ']' + ': sen_connect');
          sensorHubMapUpdate(device_id, message.toString());
          break;
      }
    case msgType.sen_disconnect:
      {
          console.log('[' + device_id + ']' + ': sen_disconnect');
          /*
          var res = sensor_hub_map_remove_senhub( device_id );
          //console.log("result = " + res);
          break;
          */
      }
    case msgType.sen_info_spec:
      {
          //console.log('[' + device_id + ']' + ': sen_info_spec');
          /*
          var res = sensor_hub_map_get_senhub( device_id, function ( senObj ){ 
            //console.log('[senObj]: ' + senObj );
            senObj.dev_info_spec = message.toString();
          } );
          */
          //console.log("result = " + res);
          break;
      }
    case msgType.sen_info:
      {
          //console.log('[' + device_id + ']' + ': sen_info');
          /*
          var res = sensor_hub_map_get_senhub( device_id, function ( senObj ){ 
            //console.log('[senObj]: ' + senObj );
            senObj.dev_info = message.toString();
          } );
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
  //console.log('--------------------------------------------------------------');
  
})

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


function getDeviceMapObj( deviceType, deviceID, outObj ){
  
  if ( deviceType === 'connectivityMap' ){
    if ( connectivityMap.has(deviceID) === false ) {
      outObj = JSON.parse(JSON.stringify(devObj));
    }
    else{
      outObj = connectivityMap.get(deviceID);
    }  
  }
  
  if ( deviceType === 'sensorHubMap' ){
    if ( sensorHubMap.has(deviceID) === false ) {
      outObj = JSON.parse(JSON.stringify(devObj));
    }
    else{
      outObj = sensorHubMap.get(deviceID);
    }  
  }
  
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
                 console.log( 'messageType =' + messageType + ', [layer] :' + layer + ', connType='+ connType +', infoObj[' + key +']=======>' + infoObj[key] );
                 var device_id=infoObj[key];
                 if ( connectivityMap.has(device_id) === false ) {
                   //copy devObj object as vgw objcect
                   var connectivity = JSON.parse(JSON.stringify(devObj));
                 }
                 else{
                   var connectivity = connectivityMap.get(device_id);
                 }
                
                 if ( messageType === msgType.vgw_info_spec ){ 
                   connectivity.vgw_id = vgw_id;
                   connectivity.os_info = osInfo;
                   connectivity.conn_id = device_id; 
                   connectivity.conn_type = connType;
                   connectivity.dev_info_spec = JSON.stringify(infoObj['Info']);
                 }
                   
                 if ( messageType === msgType.vgw_info ){
                   connectivity.dev_info = JSON.stringify(infoObj['Info']);
                 }
                 console.log('[' + device_id + ']' + ': update connectivityMap key pairs');
                 connectivityMap.set(device_id, connectivity );                
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


function sensorHubMapUpdate(device_id, connect_msg){
          
  console.log('connect msg ===== ' + connect_msg);
  connectivityMap.forEach(function(obj, key) {
    //console.log('sensorHubMapUpdate XXXXXXXXXXXXXXXX conn key = ' + key); 
    //console.log('obj.dev_info = ' + obj.dev_info);
    var infoObj = JSON.parse ( obj.dev_info );
    var outObj = {
                  key:'SenHubList',
                  is_n_sv_format: true, 
                  result:''
                 };
    getObjKeyValue(infoObj, outObj);
    //console.log('XXXXXXXXXXXXXXXX SenHubList = ' + outObj.result);
    var sensorHubList = outObj.result.split(',');
    for (var i=0 ; i < sensorHubList.length ; i++){
      if(sensorHubList[i] === device_id){
        console.log('sensorHub(' + device_id + '): conn_id=' + obj.conn_id + ', vgw_id=' + obj.vgw_id  );
        if ( sensorHubMap.has(device_id) === false ) {
          var sensorhub = JSON.parse(JSON.stringify(devObj));
        }
        else{
          var sensorhub = sensorHubMap.get(device_id);
        }
        sensorhub.vgw_id = obj.vgw_id;
        sensorhub.os_info = obj.os_info;
        sensorhub.conn_id = obj.conn_id;
        sensorhub.conn_type = obj.conn_type;
        sensorhub.connect = connect_msg;
        sensorHubMap.set(device_id, sensorhub );        
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
  if ( vgw_map.has(vgw_id) === false ) {
    console.log('[getOSType] vgw_map.has(vgw_id) === false');
    return 'null';
  }
    
  var vgw=vgw_map.get(vgw_id);
  if (typeof vgw === 'undefined') {
    console.log('[getOSType] vgw_map.has(vgw_id) === false');
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
  
    console.log('Show all vgw_map. count= ' + vgw_map.count());
    vgw_map.forEach(function(obj, key) {
      console.log('key = ' + key); 
      if ( vgw_id === key ){
        vgw_map.remove(key);
      }
    });     
    console.log('Show all vgw_map. count= ' + vgw_map.count());
    console.log('--------------------------------------------------------------');    
    console.log('Show all connectivityMap. count= ' + connectivityMap.count());
    connectivityMap.forEach(function(obj, key) {
      console.log('key = ' + key); 
      if ( vgw_id === obj.vgw_id ){
         console.log('connectivityMap.remove() key = ' + key);
         console.log('----');
         console.log('vgw_id = ' + obj.vgw_id);
         console.log('conn_id = ' + obj.conn_id);
         console.log('conn_type = ' + obj.conn_type);
         console.log('os info = ' + obj.os_info);
         console.log('conn dev_info_spec = ' + obj.dev_info_spec);
         console.log('conn dev_info = ' + obj.dev_info);
         //console.log('conn_type = ' + obj.conn_type);
         console.log('----');
         connectivityMap.remove(key);
      }
    });     
    console.log('Show all connectivityMap. count= ' + connectivityMap.count());
    console.log('--------------------------------------------------------------');
    console.log('Show all sensorHubMap. count= ' + sensorHubMap.count());
    sensorHubMap.forEach(function(obj, key) {
      console.log('key = ' + key); 
      if ( vgw_id === obj.vgw_id ){
         console.log('sensorHubMap.remove() key = ' + key);
         console.log('----');
         console.log('vgw_id = ' + obj.vgw_id);
         console.log('conn_id = ' + obj.conn_id);
         console.log('conn_type = ' + obj.conn_type);
        console.log('sensorhub connect = ' + obj.connect);
         console.log('os info = ' + obj.os_info);
         console.log('sensorhub dev_info_spec = ' + obj.dev_info_spec);
         console.log('sensorhub dev_info = ' + obj.dev_info);
         //console.log('conn_type = ' + obj.conn_type);
         console.log('----');
         sensorHubMap.remove(key);
      }
    });     
    console.log('Show all sensorHubMap. count= ' + sensorHubMap.count());
    console.log('--------------------------------------------------------------');  
  
  
/*  
  console.log('vgw_map_remove_vgw =================');
  var vgw_type = getOSType( vgw_id );
  var conn_id;
  
  if ( vgw_type === osType.none_ip_base ){
    //console.log('[' + vgw_id + ']=====' + ':' + osType.none_ip_base);
    //vgw_map.remove(device_id);
    conn_map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
        if ( obj.vgw_id === vgw_id ){
          conn_id = key;
          console.log('remove conn_id == ' + conn_id + ', vgw_id=' + obj.vgw_id);
          //remove all sensor hub
          obj.sensor_hub_list.clear();
          conn_map.remove(conn_id);
          return;
        }
      }
    }); 
    
    //remove connectivity
    console.log('XXXXXXXXXXXXXXXXXXXXXXXX remove conn_id == ' + conn_id );
    conn_map.remove(conn_id);
  }
  
  if ( vgw_type === osType.ip_base ){
    console.log('[' + vgw_id + ']=====' + ':' + osType.ip_base);
  }
*/  
}

function sensor_hub_map_add_senhub( vgw_id, conn_id, layer, infoObj ){
  
  //console.log( 'Start-------------------------------------------------');
  layer++;
  for (key in infoObj) {
      if (infoObj.hasOwnProperty(key)) {
          if ( infoObj[key] === 'SenHubList' ){
             console.log( 'SenHubList :' + infoObj['sv'] );
             console.log( 'SenHubList length :' + infoObj['sv'].toString().length ); 
            
             if ( typeof infoObj['sv'] !== 'undefined' && infoObj['sv'].toString().length !== 0 ){
               var conn = conn_map.get(conn_id);
               if ( typeof conn !== 'undefined' && typeof conn.sensor_hub_list !== 'undefined'){
                 var sen_arr = infoObj['sv'].split(',');
                 for (var i=0 ; i < sen_arr.length ; i++){
                   console.log('=== sen_arr['+i+'] = ' + sen_arr[i]);
                   var device_id = sen_arr[i];
                   if ( conn.sensor_hub_list.has( device_id ) === false ){
                       console.log('=====================device_id=' + device_id);
                       var senObj = JSON.parse(JSON.stringify(devObj));
                       senObj.vgw_id = conn.vgw_id;
                       conn.sensor_hub_list.set(device_id, senObj);
                   }
                 }
               }
               else{
                 console.log( conn_id + ' does not exist or conn.sensor_hub_list is undefined');
               }
             }
          }
        
          if ( key === 'bn' ){
              if ( layer === 3 ){
                 conn_id = infoObj[key];
              }
          }
          
      }
   }
 //
  for (key in infoObj) {
      if (infoObj.hasOwnProperty(key)) {
          //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
          if (typeof infoObj[key] === 'object' ){
              sensor_hub_map_add_senhub(vgw_id, conn_id, layer, infoObj[key]);
          }
      }
   }  
  
   layer--;  
}

function sensor_hub_map_get_senhub( sensor_hub_id, callback ){
  
    var res=-1;
  
    conn_map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
          if ( obj.sensor_hub_list.has ( sensor_hub_id ) === true ){
            res = 0;
            callback(obj.sensor_hub_list.get( sensor_hub_id ));
            return;
          }
      }
    });
  
    return res;
}

function sensor_hub_map_remove_senhub( sensor_hub_id ){
  
    var res=-1;
  
    conn_map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
          if ( obj.sensor_hub_list.has ( sensor_hub_id ) === true ){
            //console.log('obj.sensor_hub_list.has ( sensor_hub_id ) === true');
            obj.sensor_hub_list.remove ( sensor_hub_id );
            res = 0;
          }
      }
    }); 
   
    return res;
}

function getConnectivity( vgw_id, layer, connType, infoObj ){
  
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
                 console.log( '[layer] :' + layer + ', connType='+ connType +', infoObj[' + key +']=======>' + infoObj[key] ); 
                 var device_id=infoObj[key];
                 if ( vgw_map.has(vgw_id) === true ){
                   var vgw = vgw_map.get(vgw_id);
                   if ( vgw.conn_id === 'null'){
                     vgw.conn_id = device_id;
                   }
                   else{
                     vgw.conn_id += ',';
                     vgw.conn_id += device_id;
                   }
                 }
                 /*
                 if ( conn_map.has(device_id) === false ) {
                     //console.log('[' + device_id + ']' + ': remove vgw_map');
                     //console.log('getOSType(vgw_id) =========== ' + getOSType(vgw_id));                                      
                     var sen_hub_map = new HashMap();
                     var connObj = { vgw_id: vgw_id,  os_type: getOSType(vgw_id), sensor_hub_list: sen_hub_map };           
                     conn_map.set(device_id, connObj);                   
                 }
                 else{
                     //var conn = conn_map.get(device_id);
                      //conn.vgw_id = vgw_id;            
                 }
                 */
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
              getConnectivity(vgw_id, layer, connType, infoObj[key]);
          }
      }
   }  
  
   layer--;
   return;    
}

/*
function conn_map_add_connectivity( vgw_id, layer, connType, infoObj ){
  
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
                 console.log( '[layer] :' + layer + ', connType='+ connType +', infoObj[' + key +']=======>' + infoObj[key] ); 
                 var device_id=infoObj[key];
                
                 if ( conn_map.has(device_id) === false ) {
                     //console.log('[' + device_id + ']' + ': remove vgw_map');
                     //console.log('getOSType(vgw_id) =========== ' + getOSType(vgw_id));                                      
                     var sen_hub_map = new HashMap();
                     var connObj = { vgw_id: vgw_id,  os_type: getOSType(vgw_id), sensor_hub_list: sen_hub_map };           
                     conn_map.set(device_id, connObj);                   
                 }
                 else{
                     //var conn = conn_map.get(device_id);
                      //conn.vgw_id = vgw_id;            
                 }
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
              conn_map_add_connectivity(vgw_id, layer, connType, infoObj[key]);
          }
      }
   }  
  
   layer--;
   return;    
}
*/

function is_ip_valid( ip ){
  
  console.log( '[is_ip_valid] ip = ' + ip);
  var ip_arr=ip.split('.');
  console.log( 'ip_arr.length = ' + ip_arr.length);
  if (ip_arr.length !== 4 ){
      return false;
  }
  /*
  if ( ip === '0.0.0.0'){
    return false;
  }
  if (ip_arr[0] === 0 && ip_arr[1] === 0 &&
      ip_arr[2] === 0 && ip_arr[3] === 0){
      return false;
  }
  */
  
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
    /*
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
