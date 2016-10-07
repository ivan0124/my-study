var mqtt = require('mqtt');

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

function vgw_connect(dev_type, ver, vgw_mac, connected ){
  
  var msg='{\"susiCommData\":{\"devID\":\"0000000E4CABCD99\",\"parentID\":\"\",\
            \"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCD99\",\"mac\":\"000E4CABCD99\",\
            \"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
            \"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\
            \"requestID\":21,\"agentID\":\"0000000E4CABCD99\",\
            \"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}';
   
  var msgObj = JSON.parse(msg);
 
  msgObj.susiCommData.type = dev_type;
  msgObj.susiCommData.version = ver;
  msgObj.susiCommData.mac = vgw_mac;
  msgObj.susiCommData.sn = vgw_mac;
  msgObj.susiCommData.hostname = dev_type + '('+ vgw_mac.substr(8,4) + ')';
  msgObj.susiCommData.devID ='0000' + vgw_mac;
  msgObj.susiCommData.agentID ='0000' + vgw_mac;
  msgObj.susiCommData.sendTS.$date = new Date().getTime();
  
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

function vgw_send_os_info( dev_type, ver, vgw_mac, is_ip_base ){
  
  var msg='{\"susiCommData\":{\"osInfo\":{\"cagentVersion\":\"3.1.23\",\
  \"cagentType\":\"IoTGW\",\"osVersion\":\"SnailOS\",\"biosVersion\":\"\",\"platformName\":\"\",\"processorName\":\"SnailGW\",\
  \"osArch\":\"SnailX86\",\"totalPhysMemKB\":123,\"macs":"000E40ABCD99\",\"IP\":\"192.168.1.1\"},\"commCmd\":116,\"requestID\":109,\
  \"agentID\":\"0000000E40ABCD99\",\"handlerName\":\"general\",\"sendTS\":1466730390}}';
   
  var msgObj = JSON.parse(msg);
 
  msgObj.susiCommData.osInfo.cagentType = dev_type;
  msgObj.susiCommData.osInfo.cagentVersion = ver;
  msgObj.susiCommData.osInfo.macs= vgw_mac;
  msgObj.susiCommData.agentID = '0000' + vgw_mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  
  if ( is_ip_base === true ){
    msgObj.susiCommData.osInfo.IP = '127.0.0.1';
  }
  else{
    msgObj.susiCommData.status = '0.0.0.0';
  }
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
}

module.exports = {
  test: function() {
    console.log('[wise_snail] test');
    var mac='000E4CABCD77';
    var dev_type='IoTGW';
    var ver = '3.1.23';
    vgw_connect(dev_type, ver, mac, true);
    vgw_send_os_info(dev_type, ver,  mac, true);
    return;
  },
};
