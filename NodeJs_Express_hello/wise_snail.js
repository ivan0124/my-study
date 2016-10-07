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

function vgw_agentinfoack(vgw_mac, connected ){
  
  var msg='{\"susiCommData\":{\"devID\":\"0000000E4CABCD99\",\"parentID\":\"\",\
            \"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCD99\",\"mac\":\"000E4CABCD99\",\
            \"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
            \"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\
            \"requestID\":21,\"agentID\":\"0000000E4CABCD99\",\
            \"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}';
   
  //var vgw = JSON.parse(JSON.stringify(devObj));
  var msgObj = JSON.parse(msg);
 
  msgObj.susiCommData.mac = vgw_mac;
  msgObj.susiCommData.sn = vgw_mac;
  msgObj.susiCommData.hostname = 'IotGW('+ vgw_mac.substr(8,4) + ')';
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

module.exports = {
  test: function() {
    console.log('[wise_snail] test');
    vgw_agentinfoack('000E4CABCD77', false);
    return;
  },
};
