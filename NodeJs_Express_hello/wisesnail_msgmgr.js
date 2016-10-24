//Mqtt
var Mqtt = require('mqtt');
var HashMap = require('hashmap').HashMap;
var VgwMap = new HashMap();
var SensorHubMap = new HashMap();
var ConnectivityMap = new HashMap();
var DeviceInfoMap = new HashMap();
//var IoTGWCapability;

var Client  = Mqtt.connect('mqtt://127.0.0.1');
Client.queueQoSZero = false;

const MSG_TYPE = { 
                   error: -1, 
		   unknown: 0,
                   vgw_connect: 1, 
		   vgw_os_info: 2, 
		   vgw_info_spec: 3, 
	           vgw_willmessage: 4,
                   vgw_disconnect: 5, 
		   vgw_info: 6,
                   sen_connect: 7, 
		   sen_disconnect: 8, 
		   sen_info_spec: 9, 
		   sen_info: 10 
		 };
				 
const OS_TYPE = { 
                  none_ip_base: 'none_ip_base', 
		  ip_base: 'ip_base'
		};
				
const DEVICE_OBJ = { 
                     vgw_id: 'null', 
                     conn_id: 'null',
                     conn_type: 'null',
                     connect: 'null', 
                     os_info: 'null', 
                     dev_info_spec: 'null',  
                     dev_info: 'null',
                     dev_capability: 'null',
	             dev_full_devinfo: 'null',
                   };

var mqttConnectCallback =  function () {
  console.log('[wisesnail_msgmgr] Mqtt connect !!!!');
  Client.subscribe('/cagent/admin/+/agentinfoack');
  Client.subscribe('/cagent/admin/+/willmessage');
  Client.subscribe('/cagent/admin/+/agentactionreq');
  Client.subscribe('/cagent/admin/+/deviceinfo'); 
   
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
    case MSG_TYPE.vgw_connect:
      {
          console.log('[' + device_id + ']' + ': vgw_connect');
          removeVGW( device_id );
         
          if ( VgwMap.has(device_id) === false ) {
              //copy DEVICE_OBJ object as vgw objcect
              var vgw = JSON.parse(JSON.stringify(DEVICE_OBJ));
          }
          else{
             var vgw = VgwMap.get(device_id);
          }
              
          vgw.connect = message.toString();            
          vgw.vgw_id = device_id.toString();
          VgwMap.set(device_id, vgw );        
          break;
      }
    case MSG_TYPE.vgw_disconnect:
      {
          console.log('[' + device_id + ']' + ': vgw_disconnect');
          removeVGW( device_id );
          break;        
      }      
    case MSG_TYPE.vgw_os_info:
      {
          console.log('[' + device_id + ']' + ': vgw_os_info, IP=' + jsonObj.susiCommData.osInfo.IP);
          if ( VgwMap.has(device_id) === true ) {
                var vgw=VgwMap.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.os_info = message.toString();
                }
          }
          else{
               console.log('[MSG_TYPE.vgw_os_info]: VgwMap does not exist !!');
          }
          
          break;
      }
    case MSG_TYPE.vgw_info_spec:
      {
          console.log('[' + device_id + ']' + ': vgw_info_spec');
          if ( VgwMap.has(device_id) === true ) {
                var vgw = VgwMap.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info_spec = message.toString();
                  //add ConnectivityMap here
                    var infoObj=jsonObj.susiCommData.infoSpec.IoTGW;
                    //console.log( '[ConnectivityMapUpdate] Start-------------------------------------------------');
                    connectivityMapUpdate(MSG_TYPE.vgw_info_spec, device_id , vgw.os_info, 0, 'null', infoObj); 
                    //console.log( '[ConnectivityMapUpdate] End---------------------------------------------------');                  
                }
          }
          else{
               console.log('[MSG_TYPE.vgw_info_spec]: VgwMap does not exist !!');
          }        
          break;
      }
    case MSG_TYPE.vgw_info:
      {
          console.log('[' + device_id + ']' + ': vgw_info');
          if ( VgwMap.has(device_id) === true ) {
                var vgw=VgwMap.get(device_id);
                if (typeof vgw !== 'undefined') {
                  vgw.dev_info = message.toString();
                  var infoObj=jsonObj.susiCommData.data.IoTGW;
                  //console.log( '[ConnectivityMapUpdate] Start-------------------------------------------------');
                  connectivityMapUpdate(MSG_TYPE.vgw_info, device_id , vgw.os_info, 0, 'null', infoObj); 
                  //console.log( '[ConnectivityMapUpdate] End---------------------------------------------------');   
                }
          }
          else{
               console.log('[MSG_TYPE.vgw_info]: VgwMap does not exist !!');
          }         
          break;
      }
    case MSG_TYPE.vgw_willmessage:
      {
          console.log('[' + device_id + ']' + ': vgw_willmessage');
          removeVGW( device_id );
          break;
      }
    case MSG_TYPE.sen_connect:
      {
          console.log('[' + device_id + ']' + ': sen_connect');
          sensorHubMapUpdate(MSG_TYPE.sen_connect, device_id, message.toString());
          break;
      }
    case MSG_TYPE.sen_disconnect:
      {
          console.log('[' + device_id + ']' + ': sen_disconnect');
      }
    case MSG_TYPE.sen_info_spec:
      {
         console.log('[' + device_id + ']' + ': sen_info_spec');
         sensorHubMapUpdate(MSG_TYPE.sen_info_spec, device_id, message.toString());
         break;
      }
    case MSG_TYPE.sen_info:
      {    
        //console.log('[' + device_id + ']' + ': sen_info');
        sensorHubMapUpdate(MSG_TYPE.sen_info, device_id, message.toString());
	      
	/*
	//code one
        var keyStr = '';
	var restObjList = [];
	DeviceInfoMapUpdate(keyStr, jsonObj.susiCommData.data);
	      
	DeviceInfoMap.forEach(function(obj, key) {
          console.log('restPath = ' + key + ', restPath val = ' + obj.val);
        });
	*/
	
	
	// code two
	var sensorHub = SensorHubMap.get( device_id);    
	var jsonInfoSpec = JSON.parse(sensorHub.dev_info_spec );
	//console.log( sensorHub.dev_info_spec );
	//
	keyStr = '';
	var allDeviceInfoObj = JSON.parse(JSON.stringify(jsonInfoSpec.susiCommData.infoSpec));
        buildAllDeviceInfoObj(keyStr, allDeviceInfoObj);
	sensorHub.dev_full_devinfo = JSON.stringify(allDeviceInfoObj);
	//console.log( sensorHub.dev_full_devinfo );
	//
	keyStr = '';
	setRESTFulList( keyStr = '', allDeviceInfoObj, {});     
	console.log( JSON.stringify(allDeviceInfoObj) );
		      
        break;
      }
    case MSG_TYPE.unknown:
      console.log('MSG_TYPE.unknown');
      break;
    default:
      console.log('default');
      break;
  }
  //console.log('--------------------------------------------------------------');  
}

function getObjKeyValue( jsonObj, outObj){

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

   return;  
}

function getDeviceCapability( devInfoSpecObj, devInfoObj ){
                  
  for ( var i=0 ; i < devInfoSpecObj['Info']['e'].length ; i++){
    if ( typeof devInfoSpecObj['Info']['e'][i].v !== 'undefined' && devInfoObj['Info']['e'][i].v !== 'undefined' ){
      devInfoSpecObj['Info']['e'][i].v =  devInfoObj['Info']['e'][i].v;
      //console.log('v..devInfoSpecObj.e['+ i +'].n = ' +  JSON.stringify(devInfoSpecObj['Info']['e'][i]['n']));
    }
                     
    if ( typeof devInfoSpecObj['Info']['e'][i].sv !== 'undefined' && devInfoObj['Info']['e'][i].sv !== 'undefined' ){
      devInfoSpecObj['Info']['e'][i].sv =  devInfoObj['Info']['e'][i].sv;
      //console.log('sv..devInfoSpecObj.e['+ i +'].n = ' +  JSON.stringify(devInfoSpecObj['Info']['e'][i]['n']));
    } 
                     
    if ( typeof devInfoSpecObj['Info']['e'][i].bv !== 'undefined' && devInfoObj['Info']['e'][i].bv !== 'undefined' ){
      devInfoSpecObj['Info']['e'][i].bv =  devInfoObj['Info']['e'][i].bv;
      //console.log('bv..devInfoSpecObj.e['+ i +'].n = ' +  JSON.stringify(devInfoSpecObj['Info']['e'][i]['n']));
    }                        
                      
    //console.log('devInfoSpecObj.e['+ i +'] = ' +  JSON.stringify(devInfoSpecObj['Info']['e'][i]));
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
                 //console.log( 'messageType =' + messageType + ', [layer] :' + layer + ', connType='+ connType +', infoObj[' + key +']=======>' + infoObj[key] );
                 var device_id=infoObj[key];
                 if ( ConnectivityMap.has(device_id) === false ) {
                   //copy DEVICE_OBJ object as vgw objcect
                   var connectivity = JSON.parse(JSON.stringify(DEVICE_OBJ));
                 }
                 else{
                   var connectivity = ConnectivityMap.get(device_id);
                 }
                
                 if ( messageType === MSG_TYPE.vgw_info_spec ){ 
                   connectivity.vgw_id = vgw_id;
                   connectivity.os_info = osInfo;
                   connectivity.conn_id = device_id; 
                   connectivity.conn_type = connType;
                   connectivity.dev_info_spec = JSON.stringify(infoObj);
                 }
                   
                 if ( messageType === MSG_TYPE.vgw_info ){
  
                   var tmpInfoSpecObj = JSON.parse(connectivity.dev_info_spec);
                   getDeviceCapability(tmpInfoSpecObj, infoObj);
                   
                   connectivity.dev_info = JSON.stringify(infoObj['Info']);
                   connectivity.dev_capability = JSON.stringify(tmpInfoSpecObj);
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
          var sensorhub = JSON.parse(JSON.stringify(DEVICE_OBJ));
        }
        else{
          var sensorhub = SensorHubMap.get(device_id);
        }
        sensorhub.vgw_id = obj.vgw_id;
        sensorhub.os_info = obj.os_info;
        sensorhub.conn_id = obj.conn_id;
        sensorhub.conn_type = obj.conn_type;
        if ( MSG_TYPE.sen_connect === messageType){
          sensorhub.connect = message;
        }
        if ( MSG_TYPE.sen_info_spec === messageType){
          sensorhub.dev_info_spec = message;
        }        
        if ( MSG_TYPE.sen_info === messageType){
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
                 return MSG_TYPE.vgw_connect;
             }
             if ( jsonObj.susiCommData.status === 0){
                 return MSG_TYPE.vgw_disconnect;
             }
        }
      
        if ( jsonObj.susiCommData.type === 'SenHub' && 
             jsonObj.susiCommData.commCmd === 1 ){
             if ( jsonObj.susiCommData.status === '1' || jsonObj.susiCommData.status === 1){
                 return MSG_TYPE.sen_connect;
             }
             if ( jsonObj.susiCommData.status === '0' || jsonObj.susiCommData.status === 0){
                 return MSG_TYPE.sen_disconnect;
             }
        }      
    }
  
    if ( topic_arr[4] === 'agentactionreq'){
        if ( jsonObj.susiCommData.commCmd === 116 ){
            return MSG_TYPE.vgw_os_info;
        }
      
        if ( jsonObj.susiCommData.commCmd === 2052 ){
            if ( typeof jsonObj.susiCommData.infoSpec.IoTGW !== 'undefined' ){
                return MSG_TYPE.vgw_info_spec;
            }  
          
            if ( typeof jsonObj.susiCommData.infoSpec.SenHub !== 'undefined' ){
                return MSG_TYPE.sen_info_spec;
            }  
        }       
    }
  
    if ( topic_arr[4] === 'deviceinfo'){   
        if ( jsonObj.susiCommData.commCmd === 2055 ){
            if ( typeof jsonObj.susiCommData.data.IoTGW !== 'undefined' ){
                return MSG_TYPE.vgw_info;
            }  
          
            if ( typeof jsonObj.susiCommData.data.SenHub !== 'undefined' ){
                return MSG_TYPE.sen_info;
            }          
          
        }       
    }  
  
    if ( topic_arr[4] === 'willmessage'){
        return MSG_TYPE.vgw_willmessage;
    }
    
    
    return MSG_TYPE.unknown;
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
    console.log('[' + vgw_id + ']' + ': ' + OS_TYPE.ip_base);
    return OS_TYPE.ip_base;
  }
  else{
    console.log('[' + vgw_id + ']' + ':' + OS_TYPE.none_ip_base);
    return OS_TYPE.none_ip_base;
  }  
  
  return 'null';
  
}

function removeVGW( vgw_id ){

    console.log('--------------------------------------------------------------');
  
    if ( getOSType(vgw_id) == OS_TYPE.none_ip_base){
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

           console.log('----');
           console.log('vgw_id = ' + obj.vgw_id);
           console.log('conn_id = ' + obj.conn_id);
           console.log('conn_type = ' + obj.conn_type);
           console.log('os info = \n' + obj.os_info);
           console.log('conn dev_info_spec = \n' + obj.dev_info_spec);
           console.log('conn dev_info = \n' + obj.dev_info);
           console.log('conn dev_capability = \n' + obj.dev_capability);
           //console.log('conn_type = ' + obj.conn_type);
           console.log('----');

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
    }
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
/*getRESTFulList*/
function buildAllDeviceInfoObj( keyStr, jsonObj){
  
  var regexArrayPath = new RegExp('e\/[0-9]*\/[A-Z a-z 0-9]*\/?$');
  var regexArrayOKPath = new RegExp('e\/[0-9]*\/(n|v|sv|bv)\/?$');
	
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      var jsonKeyStr = keyStr + '/' + key ;
      //console.log( '[buildAllDeviceInfoObj]jsonKeyStr =======>' + jsonKeyStr + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key]));
      if ( regexArrayPath.test(jsonKeyStr) ){
	if (regexArrayOKPath.test(jsonKeyStr) === false ){
          console.log('delete ' + jsonKeyStr);
          delete jsonObj[key];
	}
      }
    }
  }
  //
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      if (typeof jsonObj[key] === 'object' ){
	//outputObj[key] = {};
        buildAllDeviceInfoObj( keyStr + '/' + key, jsonObj[key]);
      }
    }
  }  
	
  return;  

}


function setRESTFulList( keyStr, jsonObj, inputObjList ){
  
  var regexArrayPath = new RegExp('e\/[0-9]*\/n\/?$');
	
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      var jsonKeyStr = keyStr + '/' + key ; 
      if ( typeof jsonObj[key] !==  'object' ){
	if ( regexArrayPath.test(jsonKeyStr) ){
	  var restPath = jsonKeyStr.replace(/e\/[0-9]*\/n\/?$/g,jsonObj[key]);
 	
	  restPath = restPath.replace(/^\//g,'');
	  var restObj = DeviceInfoMap.get(restPath);
	  if ( typeof restObj !== 'undefined'){
	    console.log( '[setRESTFulList]jsonKeyStr =======>' + jsonKeyStr + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key]));	  
            jsonObj[restObj.valKey] = restObj.val;
            DeviceInfoMap.remove(restPath);
            console.log( 'DeviceInfoMap.count() = ' + DeviceInfoMap.count());
	  }
	}
        
      }
    }
  }
  //
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      if (typeof jsonObj[key] === 'object' ){
        setRESTFulList( keyStr + '/' + key, jsonObj[key], inputObjList);
      }
    }
  }  
	
  return;  

}


function DeviceInfoMapUpdate( keyStr, jsonObj ){
  
  var regexArrayPath = new RegExp('e\/[0-9]*\/n\/?$');
	
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      var jsonKeyStr = keyStr + '/' + key ; 
      if ( typeof jsonObj[key] !==  'object' ){
	if ( regexArrayPath.test(jsonKeyStr) ){
          console.log( '[DeviceInfoMapUpdate]jsonKeyStr =======>' + jsonKeyStr + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key]));
	  var restPath = jsonKeyStr.replace(/e\/[0-9]*\/n\/?$/g,jsonObj[key]);
          var restPathValue;
          var restPathValueKey;
          if ( typeof jsonObj['v'] !== 'undefined' ){
            restPathValue = jsonObj['v'];
 	    restPathValueKey = 'v';
	  }
          if ( typeof jsonObj['sv'] !== 'undefined' ){
            restPathValue = jsonObj['sv']; 
            restPathValueKey = 'sv';
	  }	
          if ( typeof jsonObj['bv'] !== 'undefined' ){
            restPathValue = jsonObj['bv'];
	    restPathValueKey = 'bv';	  
	  }		
	  
	  var restObj = {};
          restObj.path = restPath.replace(/^\//g,'');
	  restObj.val = restPathValue;
          restObj.valKey = restPathValueKey;
	  //outputObj.push(restObj);
	  DeviceInfoMap.set(restObj.path, restObj);
          console.log('restPath = ' + restPath + ', restPathValue = ' + restPathValue);
	}
        
      }
    }
  }
  //
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      if (typeof jsonObj[key] === 'object' ){
        DeviceInfoMapUpdate( keyStr + '/' + key, jsonObj[key]);
      }
    }
  }  
	
  return;  

}

function getRESTFulValue( apiPath, keyStr, jsonObj, outputObj ){
  
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      var jsonKeyStr = keyStr + '/' + key ; 
      if ( apiPath === jsonKeyStr ){
        //console.log( 'jsonKeyStr =======>' + jsonKeyStr + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key]));
        outputObj.resultStr = JSON.stringify(jsonObj[key]);
      }
    }
  }
  //
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      if (typeof jsonObj[key] === 'object' ){
        getRESTFulValue( apiPath, keyStr + '/' + key, jsonObj[key], outputObj);
      }
    }
  }  
	
  return;  

}

function getIoTGWConnectivityCapability(){
  
  console.log('getTotalConnectivityCapability');
  IoTGWCapability = {};
  IoTGWCapability.IoTGW = {};
  ConnectivityMap.forEach(function(obj, key) {
    console.log('----');
    console.log('key = ' + key); 
    console.log('conn dev_capability = \n' + obj.dev_capability);
    var connectivityName = obj.conn_id;
    var connectivityType = obj.conn_type;
    
    if ( typeof IoTGWCapability.IoTGW[connectivityType] === 'undefined' ){
      IoTGWCapability.IoTGW[connectivityType] = {};
    }      
    if ( typeof IoTGWCapability.IoTGW[connectivityType][connectivityName] === 'undefined' ){
      IoTGWCapability.IoTGW[connectivityType][connectivityName] = {};
    } 
        
    IoTGWCapability.IoTGW[connectivityType][connectivityName] = JSON.parse(obj.dev_capability) ;
    console.log('----');

  });       

  return JSON.stringify(IoTGWCapability);
}

var wsnget = function( uri, inParam, outData ) {
  console.log('uri = ' + uri);
  var IoTGWCapability ;
  var capability = getIoTGWConnectivityCapability();
  IoTGWCapability = JSON.parse(capability);
  
  const path = '/IoTGW/BLE/0007000E40ABCD31';
  var keyStr = '' ;
  var outputObj = {} ; 
  getRESTFulValue(path, keyStr, IoTGWCapability, outputObj);
  console.log('-----------------------------------------');
  console.log(outputObj.resultStr);
  console.log('-----------------------------------------');  
  //var code = STATUS.INTERNAL_SERVER_ERROR;
  //outData.ret = RESULT;
  //code = STATUS.OK;
  return 0;
}

module.exports = {
  get: wsnget,
};

Client.on('connect', mqttConnectCallback );
Client.on('message', mqttMessageCallback);


