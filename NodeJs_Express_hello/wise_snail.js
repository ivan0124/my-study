var mqtt = require('mqtt');
var fs = require('fs');

const VGW_ID_PREFIX = '0000';
const CONN_ID_PREFIX = '0007';
const SENHUB_ID_PREFIX = '0017';
const WISESNAIL_DATAFOLDER = './wisesnail';
var timerknock;
var time = 0;
var max_time = 0;

function timeout(){
  
  console.log('timeout....' + time);
  var mac='000E40000001';
  snehubSendInfo(mac);
  time++;
  if ( time < max_time ){
    timerknock = setTimeout( timeout, 2000);
  }
}

client  = mqtt.connect('mqtt://127.0.0.1');
client.queueQoSZero = false;

client.on('connect', function () {
  console.log('[wise_snail] mqtt connect !!!!');
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
  console.log('--------------------------------------------------------------');
  
})



function sendConnectMsg(dev_type, ver, mac, product, connected ){
  
  var msg='{\"susiCommData\":{\"devID\":\"0000000E4CABCD99\",\"parentID\":\"\",\
            \"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCD99\",\"mac\":\"000E4CABCD99\",\
            \"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
            \"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\
            \"requestID\":21,\"agentID\":\"0000000E4CABCD99\",\
            \"handlerName\":\"general\",\"sendTS\":1469512074}}';
  
  if ( dev_type === 'SenHub' ){
    var msg='{\"susiCommData\":{\"devID\":\"0017000E40000001\",\
              \"hostname\":\"AAA\",\"sn\":\"0017000E40000001\",\"mac\":\"0017000E40000001\",\
              \"version\":\"3.1.23\",\"type\":\"SenHub\",\"product\":\"WISE-1520\",\
              \"manufacture\":\"\",\"status\":\"1\",\"commCmd\":1,\"requestID\":30002,\
              \"agentID\":\"0017000E40000001\",\"handlerName\":\"general\",\"sendTS\":160081026}}';
  }  
   
  var msgObj = JSON.parse(msg);
 

  msgObj.susiCommData.type = dev_type;
  msgObj.susiCommData.version = ver;
  msgObj.susiCommData.mac = mac;
  msgObj.susiCommData.sn = mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  msgObj.susiCommData.hostname = dev_type + '('+ mac.substr(8,4) + ')';
  msgObj.susiCommData.devID = VGW_ID_PREFIX + mac;
  msgObj.susiCommData.agentID = VGW_ID_PREFIX + mac;  
  
  if ( dev_type === 'SenHub' ){
    msgObj.susiCommData.devID = SENHUB_ID_PREFIX + mac;
    msgObj.susiCommData.agentID = SENHUB_ID_PREFIX + mac;    
    msgObj.susiCommData.product = product;
  }  
  
  if ( connected === true ){
    msgObj.susiCommData.status = 1;
  }
  else{
    msgObj.susiCommData.status = 0;
  }
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.devID + '/agentinfoack';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
  
}

function sendOSInfo( dev_type, ver, vgw_mac, is_ip_base ){
  
  var msg='{\"susiCommData\":{\"osInfo\":{\"cagentVersion\":\"3.1.23\",\
  \"cagentType\":\"IoTGW\",\"osVersion\":\"SnailOS\",\"biosVersion\":\"\",\"platformName\":\"\",\"processorName\":\"SnailGW\",\
  \"osArch\":\"SnailX86\",\"totalPhysMemKB\":123,\"macs":"000E40ABCD99\",\"IP\":\"0.0.0.0\"},\"commCmd\":116,\"requestID\":109,\
  \"agentID\":\"0000000E40ABCD99\",\"handlerName\":\"general\",\"sendTS\":1466730390}}';
   
  var msgObj = JSON.parse(msg);
 
  msgObj.susiCommData.osInfo.cagentType = dev_type;
  msgObj.susiCommData.osInfo.cagentVersion = ver;
  msgObj.susiCommData.osInfo.macs= vgw_mac;
  msgObj.susiCommData.agentID = VGW_ID_PREFIX + vgw_mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  
  if ( is_ip_base === true ){
    msgObj.susiCommData.osInfo.IP = '0.0.0.0';
  }
  else{
    msgObj.susiCommData.osInfo.IP = '';
  }
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
}

function vgw_send_info_spec( msgObj ){
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
}

function vgw_send_info( msgObj ){
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/deviceinfo';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);  
}

function snehubSendInfoSpec( mac ){
  
  try{
    var sensorInfoSpecObj = JSON.parse(fs.readFileSync('sensorHub.infoSpec', 'utf8'));
  }
  catch (e){
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error(e);
    return;
  }
  
  //
  var msgObj={};
  msgObj.susiCommData = {};
  msgObj.susiCommData.infoSpec = {};
  msgObj.susiCommData.infoSpec.SenHub = sensorInfoSpecObj;  
  msgObj.susiCommData.commCmd = 2052;
  msgObj.susiCommData.requestID = 2001;
  msgObj.susiCommData.agentID = SENHUB_ID_PREFIX + mac;
  msgObj.susiCommData.handlerName = 'general';
  msgObj.susiCommData.sendTS = new Date().getTime();
  
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
  
}


function getSensorHubInfo(sensorInfoObj){
  
  for (key in sensorInfoObj) {
    if (sensorInfoObj.hasOwnProperty(key)) {
      if ( key === 'n' ){
        console.log( 'key=======>' + key + ', keyVal=======>' + sensorInfoObj[key]);
        try{
          var temp = fs.readFileSync( sensorInfoObj[key] + '.dat', 'utf8');
          //remove /r/n
          var temp = temp.toString().replace(/(?:\\[rn])+/g,'');
          //remove space
          var temp = temp.toString().replace(/\s+/g,'');
          var temp_array = temp.split(',');
          //console.log('('+ sensorInfoObj[key] +')temp_array.length = ' + temp_array.length);
          console.log('('+ sensorInfoObj[key] + ')temp_array value = ' + temp_array[time]);
          
          var data_max_time = temp_array.length;
          var val;
          if ( typeof temp_array[time] === 'undefined' ){
            val = temp_array[temp_array.length - 1];
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
        getSensorHubInfo(sensorInfoObj[key]);
      }
    }
  }    
}

function snehubSendInfo( mac ){
  
  try{
    var sensorInfoObj = JSON.parse(fs.readFileSync('sensorHub.info', 'utf8'));
  }
  catch (e){
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error(e);
    return;
  }
  
  getSensorHubInfo(sensorInfoObj);
  //
  var msgObj={};
  msgObj.susiCommData = {};
  msgObj.susiCommData.data = {};
  msgObj.susiCommData.data.SenHub = sensorInfoObj;  
  msgObj.susiCommData.commCmd = 2055;
  msgObj.susiCommData.requestID = 2001;
  msgObj.susiCommData.agentID = SENHUB_ID_PREFIX + mac;
  msgObj.susiCommData.handlerName = 'general';
  msgObj.susiCommData.sendTS = new Date().getTime();
  
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/deviceinfo';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
  
}

function create_connMsg( isInfoSpec, vgw_mac, connObj, callback ){

  if ( isInfoSpec === true ){
    var msg='{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
             \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
             {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
             {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
             \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
             \"handlerName\":\"general\",\"sendTS\":160081020}}';
    var infoKeyName = 'infoSpec';
  }
  else{
    
    var msg='{\"susiCommData\":{\"data\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
             \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
             {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
             {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
             \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2055,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
             \"handlerName\":\"general\",\"sendTS\":160081020}}';
    var infoKeyName = 'data';
            
  }

  var msgObj = JSON.parse(msg);

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
  
  callback( msgObj );
}


function createConnMsg( msgObj, vgw_mac, infoKeyName, connObj ){
  console.log('createConnMsg...........................');
  /*
  if ( isInfoSpec === true ){
    var msg='{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
             \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
             {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
             {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
             \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
             \"handlerName\":\"general\",\"sendTS\":160081020}}';
    var infoKeyName = 'infoSpec';
  }
  else{
    
    var msg='{\"susiCommData\":{\"data\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
             \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
             {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
             {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
             \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2055,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
             \"handlerName\":\"general\",\"sendTS\":160081020}}';
    var infoKeyName = 'data';
            
  }

  var msgObj = JSON.parse(msg);
  */
  msgObj.susiCommData ={};
  msgObj.susiCommData[infoKeyName] = {};
  
  msgObj.susiCommData.commCmd = 2052;
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

function sendVGW( mac ){
  console.log('sendVGW(' + mac + ')...........................');
  var VGW_path = WISESNAIL_DATAFOLDER + '/VGW_' + mac + '/' ;
  
  // send VGW connect message
  var msgObj = JSON.parse(fs.readFileSync( VGW_path + 'connect.msg', 'utf8'));
  msgObj.susiCommData.sendTS = new Date().getTime();
  var topic = '/cagent/admin/' + msgObj.susiCommData.devID + '/agentinfoack';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);  
  
  // send VGW osInfo message
  var msgObj = JSON.parse(fs.readFileSync( VGW_path + 'osInfo.msg', 'utf8'));
  msgObj.susiCommData.sendTS = new Date().getTime();
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);    
  
  // send VGW infoSpec message
  var infoSpecObj = {};
  var infoObj = {};
  var connfiles = fs.readdirSync(VGW_path);
  console.log('connfiles.length = ' + connfiles.length);
  for (var i=0 ; i< connfiles.length ; i++){
    console.log('name = ' + connfiles[i]);
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
      console.log('senhubfiles.length = ' + senhubfiles.length);
      for (var j=0 ; j< senhubfiles.length ; j++){
        console.log('name = ' + senhubfiles[j]);
        var senhubRegex = new RegExp("^SENSORHUB");
        if( senhubRegex.test(senhubfiles[j]) ){
          console.log('SendorHub name = ' + senhubfiles[j]);
          
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
  
  /*
  create_connMsg(true, mac, infoSpecObj, function( msgObj ){
    console.log('create connectivity InfoSpec message object'); 
    console.log('================================================');
    infoSpecMsgObj = msgObj;
    console.log(JSON.stringify(infoSpecMsgObj));
  });
  */
  var infoSpecMsgObj={};
  createConnMsg(infoSpecMsgObj, mac, 'infoSpec', infoSpecObj);  
  vgw_send_info_spec(infoSpecMsgObj);
  
  //send VGW info
  create_connMsg(false, mac, infoObj, function( msgObj ){
    console.log('create connectivity Info message object'); 
    console.log('================================================');
    infoMsgObj = msgObj;
    console.log(JSON.stringify(infoMsgObj));
  });  
  vgw_send_info(infoMsgObj);
 
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
  client.publish(topic, message);  
  
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
  client.publish(topic, message);    
  
}

function sendSensorHubMessage( sendConnectMsg, sendInfoSpecMsg, sendInfoMsg){
  
  console.log('sendSensorHubMessage...........................');
  var regex = new RegExp("^VGW");
  var connRegex = new RegExp("^CONN");
  var sensorhubRegex = new RegExp("^SENSORHUB");
  //
  var vgwFiles = fs.readdirSync(WISESNAIL_DATAFOLDER);
  console.log('vgwFiles.length = ' + vgwFiles.length);
  for (var i=0 ; i< vgwFiles.length ; i++){
      
    if( regex.test(vgwFiles[i]) ){
      console.log('VGW name = ' + vgwFiles[i]);
      var vgw_mac = vgwFiles[i].split('_')[1];
      var VGW_path = WISESNAIL_DATAFOLDER + '/' + vgwFiles[i] + '/' ;
      var connFiles = fs.readdirSync(VGW_path);
      for (var j=0 ; j< connFiles.length ; j++){
          
        if( connRegex.test(connFiles[j]) ){
          console.log('CONN name = ' + connFiles[j]);
          var CONN_path = VGW_path + connFiles[j];
          var sensorFiles = fs.readdirSync(CONN_path);
          for (var k=0 ; k< sensorFiles.length ; k++){
              
            if( sensorhubRegex.test(sensorFiles[k]) ){
              console.log('SENSORHUB name = ' + sensorFiles[k]);
              if ( sendConnectMsg === true){
                sendSensorHubConnectMsg(CONN_path, sensorFiles[k]);
              }
              if ( sendInfoSpecMsg === true){
                sendSensorHubInfoSpecMsg(CONN_path, sensorFiles[k]);
              }
              
              if ( sendInfoMsg === true){
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
    console.log('[wise_snail] start');
    //
    var vgwFiles = fs.readdirSync(WISESNAIL_DATAFOLDER);
    console.log('vgwFiles.length = ' + vgwFiles.length);
    for (var i=0 ; i< vgwFiles.length ; i++){
      console.log('name = ' + vgwFiles[i]);
      var regex = new RegExp("^VGW");
      if( regex.test(vgwFiles[i]) ){
        sendVGW(vgwFiles[i].split('_')[1]);
      }
    } 
    //
    sendSensorHubMessage(true, true, false);
    
    /*
    var msgObj={};
    createConnMsg(msgObj, 'infoSpec');
    console.log('msgObj.test = ' + msgObj.test);
    */
    
  },
  test: function() {
    console.log('[wise_snail] test');
    var mac='000E4CABCD77';
    var dev_type='IoTGW';
    var ver = '3.1.23';
    var infoSpec1 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\",\"asm\":\"r\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
                       {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
               \"bn\":\"Info\"}';
  
    var infoSpec2 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\",\"asm\":\"r\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
                       {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
               \"bn\":\"Info\"}';
  
    var infoSpec3 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Name\",\"sv\":\"WSN\",\"asm\":\"r\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
                       {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
               \"bn\":\"Info\"}';
   
    var infoSpecObj={conn1:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD31', info: JSON.parse(infoSpec1)},
               conn2:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD32', info: JSON.parse(infoSpec2) },
               conn3:{ type: 'WSN', bnName: CONN_ID_PREFIX + '000E40ABCD33', info: JSON.parse(infoSpec3) }
              }; 
    
    var info1 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"0017000E40000000,0017000E40000001\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"0017000E40000000,0017000E40000001\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\"},\
                       {\"n\":\"reset\",\"bv\":\"0\"}],\
               \"bn\":\"Info\"}';
  
    var info2 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\"},\
                       {\"n\":\"reset\",\"bv\":\"0\"}],\
               \"bn\":\"Info\"}';
  
    var info3 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\"},\
                       {\"n\":\"Name\",\"sv\":\"WSN\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\"},\
                       {\"n\":\"reset\",\"bv\":\"0\"}],\
               \"bn\":\"Info\"}';
   
    var infoObj={conn1:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD31', info: JSON.parse(info1)},
               conn2:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD32', info: JSON.parse(info2) },
               conn3:{ type: 'WSN', bnName: CONN_ID_PREFIX + '000E40ABCD33', info: JSON.parse(info3) }
              }; 
    
    var infoSpecMsgObj;
    var infoMsgObj;
    create_connMsg(true, mac, infoSpecObj, function( msgObj ){
      console.log('create connectivity InfoSpec message object'); 
      console.log('================================================');
      infoSpecMsgObj = msgObj;
      console.log(JSON.stringify(infoSpecMsgObj));
    }); 
    
    create_connMsg(false, mac, infoObj, function( msgObj ){
      console.log('create connectivity Info message object'); 
      console.log('================================================');
      infoMsgObj = msgObj;
      console.log(JSON.stringify(infoMsgObj));
    });      
    //VGW-----------------------------------------------
    sendConnectMsg(dev_type, ver, mac, '', true);
    sendOSInfo(dev_type, ver,  mac, false);   
    vgw_send_info_spec(infoSpecMsgObj);
    vgw_send_info(infoMsgObj);
    
    //SensorHub-----------------------------------------------
    var mac='000E40000001';
    var dev_type='SenHub';
    var ver = '3.1.23';
    var product = 'WISE-1020';
    sendConnectMsg(dev_type, ver, mac, product, true);
    snehubSendInfoSpec(mac);
    
    //var mac='000E40000001';
    //snehubSendInfo(mac);
    //
    
    time = 0;
    max_time = 0;
    if ( typeof timerknock !== 'undefined'){
      clearTimeout(timerknock);
    }
    timerknock = setTimeout( timeout, 2000);
    
    //
    //   
    return;
  }
};
