var mqtt = require('mqtt');
var fs = require('fs');

const VGW_ID_PREFIX = '0000';
const CONN_ID_PREFIX = '0007';
const SENHUB_ID_PREFIX = '0017';
const WISESNAIL_DATAFOLDER = './wisesnail';
var timerknock;
var time = 0;
var max_time = 0;
var timer_interval = 2000;

var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  //console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    sendAllVGWMessage('disconnected');
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();


function timeout(){
  
  //console.log('timeout....' + time);
  sendSensorHubMessage(false, false, true);
  time++;
  if ( time < max_time ){
    timerknock = setTimeout( timeout, timer_interval);
  }
}

client.on('connect', function () {
  console.log('[wise_snail] mqtt connect to ' + mqtt_server );
  sendAllVGWMessage('');
  //
  sendSensorHubMessage(true, true, true);
  time = 0;
  max_time = 0;
  if ( typeof timerknock !== 'undefined'){
    clearTimeout(timerknock);
  }
  timerknock = setTimeout( timeout, timer_interval);   
  
})


client.on('message', function (topic, message) {
  // message is Buffer 
  console.log('--------------------------receive mqtt message------------------------------');
  
  console.log('topic=' + topic.toString() );
  console.log('msg=' + message.toString());
  
  try {
      var jsonObj = JSON.parse(message.toString());
  } catch (e) {
      console.error(e);
      return;
  }
  console.log('----------------------------------------------------------------------------');
  
})

function sendToMqttBroker(topic, message){
  
  console.log('--------------------------send mqtt message------------------------------');
  console.log('topic=' + topic.toString() );
  console.log('msg=' + message.toString());
  console.log('-------------------------------------------------------------------------');
  
  client.publish(topic, message);
}

function sendVGWInfoSpec( msgObj ){
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  sendToMqttBroker(topic, message);
}

function sendVGWInfo( msgObj ){
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/deviceinfo';
  var message = JSON.stringify(msgObj);
   sendToMqttBroker(topic, message);  
}

function getSensorHubInfo(sensorHubPath, sensorInfoObj){
  //console.log('getSensorHubInfo...........................');
  
  for (key in sensorInfoObj) {
    if (sensorInfoObj.hasOwnProperty(key)) {
      if ( key === 'n' ){
        //console.log( 'key=======>' + key + ', keyVal=======>' + sensorInfoObj[key]);
        try{
          var temp = fs.readFileSync( sensorHubPath + sensorInfoObj[key] + '.dat', 'utf8');
          //remove /r/n
          var temp = temp.toString().replace(/(?:\\[rn])+/g,'');
          //remove space
          var temp = temp.toString().replace(/\s+/g,'');
          var temp_array = temp.split(',');
          //console.log('('+ sensorInfoObj[key] +')temp_array.length = ' + temp_array.length);
          //console.log('('+ sensorInfoObj[key] + ')temp_array value = ' + temp_array[time]);
          
          var data_max_time = temp_array.length;
          var val;
          if ( typeof temp_array[time] === 'undefined' ){
            //val = temp_array[temp_array.length - 1];
            val = 0;
          }
          else{
            val = temp_array[time];                 
          }          
          /*
          for (var i=0 ; i< temp_array.length ; i++){
            console.log('('+ sensorInfoObj[key] + ')temp_array value = ' + temp_array[i]);
          } 
          */
        }
        catch(e){
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          console.error(e);
          continue;
        }
        //file exist, assign value here
        if ( data_max_time > max_time ){
          max_time = data_max_time;
        }
        
        if ( sensorInfoObj.hasOwnProperty('v')){
          sensorInfoObj['v'] = val;
        }
            
        if ( sensorInfoObj.hasOwnProperty('bv')){
          sensorInfoObj['bv'] = val;
        }          
      }
    }
  }
 //
  for (key in sensorInfoObj) {
    if (sensorInfoObj.hasOwnProperty(key)) {
      //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
      if (typeof sensorInfoObj[key] === 'object' ){
        getSensorHubInfo(sensorHubPath, sensorInfoObj[key]);
      }
    }
  }    
}

function createConnectivityMsg( msgObj, vgw_mac, infoKeyName, connObj ){
  //console.log('createConnectivityMsg...........................');

  msgObj.susiCommData ={};
  msgObj.susiCommData[infoKeyName] = {};
  
  msgObj.susiCommData.commCmd = 2052;
  if ( infoKeyName === 'infoSpec'){
    msgObj.susiCommData.commCmd = 2052;
  }
  if ( infoKeyName === 'data'){
    msgObj.susiCommData.commCmd = 2055;
  }  
  
  
  msgObj.susiCommData.requestID = 2001;
  msgObj.susiCommData.handlerName = 'general';
  msgObj.susiCommData.agentID = VGW_ID_PREFIX + vgw_mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  //create connectivity and assigne InfoMsg
  msgObj['susiCommData'][infoKeyName]['IoTGW'] = {};
  for (key in connObj) {
      if (connObj.hasOwnProperty(key)) {
        //console.log( key + ', keyVal=======>' + connObj[key]);
        //console.log( 'type=======>' + connObj[key]['type']);
        //console.log( 'bnName=======>' + connObj[key]['bnName']);
        var conn_type= connObj[key]['type'];
        var conn_bnName = connObj[key]['bnName'];
        var conn_info = connObj[key]['info'];
        
        if ( msgObj['susiCommData'][infoKeyName]['IoTGW'].hasOwnProperty(conn_type) === false ){
          //console.log( 'create type ========: ' + conn_type);
          msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type]={};
        }
        if ( msgObj['susiCommData'][infoKeyName]['IoTGW'].hasOwnProperty(conn_bnName) === false ){
          //console.log( 'create conn_bnName ========: ' + conn_bnName);
          msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type][conn_bnName]={};
        }
        //assign value
        msgObj['susiCommData'][infoKeyName]['IoTGW']['ver'] = 1;
        msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type]['bn'] = conn_type;
        msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type]['ver'] = 1;
        msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type][conn_bnName]['Info'] = conn_info;
        msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type][conn_bnName]['bn'] = conn_bnName;
        msgObj['susiCommData'][infoKeyName]['IoTGW'][conn_type][conn_bnName]['ver'] = 1;
      }
   }    
}

function sendAllVGWMessage( connectStatus ){ 
  
  var vgwFiles = fs.readdirSync(WISESNAIL_DATAFOLDER);
  //console.log('vgwFiles.length = ' + vgwFiles.length);
  for (var i=0 ; i< vgwFiles.length ; i++){
    //console.log('name = ' + vgwFiles[i]);
    var regex = new RegExp("^VGW");
    if( regex.test(vgwFiles[i]) ){
      sendVGW(vgwFiles[i].split('_')[1], connectStatus);
    }
  }   
}

function sendVGW( mac, connectStatus ){
  console.log('sendVGW(' + mac + '), status = ' + connectStatus + '...........................');
  var VGW_path = WISESNAIL_DATAFOLDER + '/VGW_' + mac + '/' ;
  
  // send VGW connect message
  var msgObj = JSON.parse(fs.readFileSync( VGW_path + 'connect.msg', 'utf8'));
  
  if ( connectStatus === 'connected' ){
    msgObj.susiCommData.status = 1;
  }
  if ( connectStatus === 'disconnected' ){
    msgObj.susiCommData.status = 0;
  }  
  
  msgObj.susiCommData.devID = VGW_ID_PREFIX + mac;
  msgObj.susiCommData.hostname = msgObj.susiCommData.type + '('+ mac.substr(8,4) + ')';
  msgObj.susiCommData.agentID = msgObj.susiCommData.devID;
  msgObj.susiCommData.sn = mac;
  msgObj.susiCommData.mac = mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  var topic = '/cagent/admin/' + msgObj.susiCommData.devID + '/agentinfoack';
  var message = JSON.stringify(msgObj);
  sendToMqttBroker(topic, message);
  //client.publish(topic, message);  
  
  // send VGW osInfo message
  var msgObj = JSON.parse(fs.readFileSync( VGW_path + 'osInfo.msg', 'utf8'));
  msgObj.susiCommData.osInfo.macs = mac;
  msgObj.susiCommData.agentID = VGW_ID_PREFIX + mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  sendToMqttBroker(topic, message);
  //client.publish(topic, message);    
  
  // send VGW infoSpec message
  var infoSpecObj = {};
  var infoObj = {};
  var connfiles = fs.readdirSync(VGW_path);
  //console.log('connfiles.length = ' + connfiles.length);
  for (var i=0 ; i< connfiles.length ; i++){
    //console.log('name = ' + connfiles[i]);
    var regex = new RegExp("^CONN");
    if( regex.test(connfiles[i]) ){
      var connObj = 'conn' + i;
      var CONN_path = VGW_path + '/' + connfiles[i] + '/';
      //
      infoSpecObj[connObj] = {};
      infoSpecObj[connObj].type = connfiles[i].split('_')[1];
      infoSpecObj[connObj].bnName = CONN_ID_PREFIX + connfiles[i].split('_')[2];   
      infoSpecObj[connObj].info = JSON.parse(fs.readFileSync( CONN_path + 'infoSpec.msg', 'utf8'));
      //
      infoObj[connObj] = {};
      infoObj[connObj].type = connfiles[i].split('_')[1];
      infoObj[connObj].bnName = CONN_ID_PREFIX + connfiles[i].split('_')[2];
      infoObj[connObj].info = JSON.parse(fs.readFileSync( CONN_path + 'info.msg', 'utf8'));
      //      
      var senhubfiles = fs.readdirSync(CONN_path);
      //var infoObj = JSON.parse(fs.readFileSync( CONN_path + 'info.msg', 'utf8'));
      infoObj[connObj].info.e[0].sv = '';
      infoObj[connObj].info.e[1].sv = '';
      
      var eObj = infoObj[connObj].info.e[0];
      eObj.sv = '';
      //console.log('senhubfiles.length = ' + senhubfiles.length);
      for (var j=0 ; j< senhubfiles.length ; j++){
        //console.log('name = ' + senhubfiles[j]);
        var senhubRegex = new RegExp("^SENSORHUB");
        if( senhubRegex.test(senhubfiles[j]) ){
          //console.log('SendorHub name = ' + senhubfiles[j]);
          
          if ( eObj.sv.length === 0 ){
            eObj.sv = SENHUB_ID_PREFIX + senhubfiles[j].split('_')[1];
          }
          else{
            eObj.sv = eObj.sv + ',';
            eObj.sv = eObj.sv + SENHUB_ID_PREFIX + senhubfiles[j].split('_')[1];
          }
          
        }
      }
      //infoObj[connObj].info = infoObj;
      //
    }
  }
  
  var infoSpecMsgObj={};
  createConnectivityMsg(infoSpecMsgObj, mac, 'infoSpec', infoSpecObj);  
  //var topic = '/cagent/admin/' + infoSpecMsgObj.susiCommData.agentID + '/agentactionreq';
  //var message = JSON.stringify(infoSpecMsgObj);  
  //sendToMqttBroker(topic, message);
  sendVGWInfoSpec(infoSpecMsgObj);
  //vgw_send_info_spec(infoSpecMsgObj);
  
  //send VGW info
  var infoMsgObj={};
  createConnectivityMsg(infoMsgObj, mac, 'data', infoObj);
  //var topic = '/cagent/admin/' + infoMsgObj.susiCommData.agentID + '/deviceinfo';
  //var message = JSON.stringify(infoMsgObj);
  sendVGWInfo(infoMsgObj);
  //vgw_send_info(infoMsgObj);
 
}

function sendSensorHubConnectMsg( ConnFilePath, SensorHubFileName ){
  
  var sensorHubMAC = SensorHubFileName.split('_')[1];
  var sensorHubPath = ConnFilePath + '/' + SensorHubFileName + '/';
  var msgObj = JSON.parse(fs.readFileSync( sensorHubPath + 'connect.msg', 'utf8'));
                
  //assign value
  msgObj.susiCommData.hostname = msgObj.susiCommData.type + '('+ sensorHubMAC.substr(8,4) + ')';
  msgObj.susiCommData.devID = SENHUB_ID_PREFIX + sensorHubMAC;
  msgObj.susiCommData.sn = msgObj.susiCommData.devID;
  msgObj.susiCommData.mac = msgObj.susiCommData.devID;
  msgObj.susiCommData.agentID = msgObj.susiCommData.devID;
  msgObj.susiCommData.sendTS = new Date().getTime();

  //send connect message
  var topic = '/cagent/admin/' + msgObj.susiCommData.devID + '/agentinfoack';
  var message = JSON.stringify(msgObj);
  sendToMqttBroker(topic, message); 
  //client.publish(topic, message);  
  
}

function sendSensorHubInfoSpecMsg( ConnFilePath, SensorHubFileName ){
  
  var sensorHubMAC = SensorHubFileName.split('_')[1];
  var sensorHubPath = ConnFilePath + '/' + SensorHubFileName + '/';
  var msgObj = JSON.parse(fs.readFileSync( sensorHubPath + 'infoSpec.msg', 'utf8'));
                
  //assign value
  msgObj.susiCommData.agentID = SENHUB_ID_PREFIX + sensorHubMAC;
  msgObj.susiCommData.sendTS = new Date().getTime();
  
  //send infoSpec message
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  sendToMqttBroker(topic, message);  
  //client.publish(topic, message);    
  
}

function sendSensorHubInfoMsg(ConnFilePath, SensorHubFileName){
  
  //console.log('sendSensorHubMessage...........................');
  var sensorHubMAC = SensorHubFileName.split('_')[1];
  var sensorHubPath = ConnFilePath + '/' + SensorHubFileName + '/';
  try{
    var sensorInfoObj = JSON.parse(fs.readFileSync(sensorHubPath + 'info.msg', 'utf8'));
  }
  catch (e){
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error(e);
    return;
  }

  //console.log('sensorHubPath = ' + sensorHubPath);
  //console.log(JSON.stringify(sensorInfoObj));
  getSensorHubInfo(sensorHubPath, sensorInfoObj);
  //
  var msgObj={};
  msgObj.susiCommData = {};
  msgObj.susiCommData.data = {};
  msgObj.susiCommData.data.SenHub = sensorInfoObj;  
  msgObj.susiCommData.commCmd = 2055;
  msgObj.susiCommData.requestID = 2001;
  msgObj.susiCommData.agentID = SENHUB_ID_PREFIX + sensorHubMAC;
  msgObj.susiCommData.handlerName = 'general';
  msgObj.susiCommData.sendTS = new Date().getTime();
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/deviceinfo';
  var message = JSON.stringify(msgObj);
  sendToMqttBroker(topic, message); 
  //client.publish(topic, message);
  
}

function sendSensorHubMessage( sendConnectMsg, sendInfoSpecMsg, sendInfoMsg){
  
  //console.log('sendSensorHubMessage...........................');
  var regex = new RegExp("^VGW");
  var connRegex = new RegExp("^CONN");
  var sensorhubRegex = new RegExp("^SENSORHUB");
  //
  var vgwFiles = fs.readdirSync(WISESNAIL_DATAFOLDER);
  //console.log('vgwFiles.length = ' + vgwFiles.length);
  for (var i=0 ; i< vgwFiles.length ; i++){
      
    if( regex.test(vgwFiles[i]) ){
      //console.log('VGW name = ' + vgwFiles[i]);
      var vgw_mac = vgwFiles[i].split('_')[1];
      var VGW_path = WISESNAIL_DATAFOLDER + '/' + vgwFiles[i] + '/' ;
      var connFiles = fs.readdirSync(VGW_path);
      for (var j=0 ; j< connFiles.length ; j++){
          
        if( connRegex.test(connFiles[j]) ){
          //console.log('CONN name = ' + connFiles[j]);
          var CONN_path = VGW_path + connFiles[j];
          var sensorFiles = fs.readdirSync(CONN_path);
          for (var k=0 ; k< sensorFiles.length ; k++){
              
            if( sensorhubRegex.test(sensorFiles[k]) ){
              //console.log('SENSORHUB name = ' + sensorFiles[k]);
              if ( sendConnectMsg === true){
                sendSensorHubConnectMsg(CONN_path, sensorFiles[k]);
              }
              if ( sendInfoSpecMsg === true){
                sendSensorHubInfoSpecMsg(CONN_path, sensorFiles[k]);
              }
              
              if ( sendInfoMsg === true){
                sendSensorHubInfoMsg(CONN_path, sensorFiles[k]);  
              }
            }
          }
        }
      }
    }
  }
 
}

module.exports = {
  start: function() {
    //console.log('[wise_snail] start');
    //
    sendAllVGWMessage('');
    //
    sendSensorHubMessage(true, true, true);
    time = 0;
    max_time = 0;
    if ( typeof timerknock !== 'undefined'){
      clearTimeout(timerknock);
    }
    timerknock = setTimeout( timeout, timer_interval);
    
  },

};

try{
  var mqtt_server = fs.readFileSync( 'mqtt_server.conf', 'utf8');
}
catch(e){
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.error(e);
  return;
}

var client  = mqtt.connect('mqtt://' + mqtt_server);
client.queueQoSZero = false;

