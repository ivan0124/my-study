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

function test1(vgw_id){
  
  var msg='{\"susiCommData\":{\"devID\":\"0000000E4CABCD99\",\"parentID\":\"\",\
            \"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCD99\",\"mac\":\"000E4CABCD99\",\
            \"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
            \"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\
            \"requestID\":21,\"agentID\":\"0000000E4CABCD99\",\
            \"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}';
   
  //var vgw = JSON.parse(JSON.stringify(devObj));
  var msgObj = JSON.parse(msg);
  msgObj.susiCommData.devID=vgw_id;
  
  
  client.publish('/cagent/admin/0000000E4CABCD99/agentinfoack', JSON.stringify(msgObj));
}

module.exports = {
  test: function() {
    console.log('[wise_snail] test');
    test1('0000000E4CABCD77');
    return;
  },
};
