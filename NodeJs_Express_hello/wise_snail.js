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

function test1(){
    client.publish('/cagent/admin/0000000E4CABCD99/agentinfoack', '{\"susiCommData\":{\"devID\":\"0000000E4CABCD99\",\"parentID\":\"\",\
\"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCD99\",\"mac\":\"000E4CABCD99\",\"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
\"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\"requestID\":21,\"agentID\":\"0000000E4CABCD99\",\
\"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}');
}

module.exports = {
  test: function() {
    console.log('[wise_snail] test');
    test1();
    return;
  },
};
