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
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

try{
  var mqtt_server = fs.readFileSync( 'mqtt_server.conf', 'utf8');
  //remove /r/n
  var mqtt_server = mqtt_server.toString().replace(/(?:\\[rn])+/g,'');
  //remove space
  var mqtt_server = mqtt_server.toString().replace(/\s+/g,'');  
}
catch(e){
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.error(e);
  process.exit();
}

var client  = mqtt.connect('mqtt://' + mqtt_server);
client.queueQoSZero = false;

client.on('connect', function () {
  console.log('[wise_snail] mqtt connect to ' + mqtt_server );
  client.subscribe('/ML_HDD/+/predict');

  sendToMqttBroker('/ML_HDD/12345/predict_result', 'ML_model response');
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
  
  sendToMqttBroker('/ML_HDD/12345/predict_result', 'ML_model response');
  
  var feature_data ='failure smart5 smart9 smart187 smart192 smart194 smart197 smart198\n1 8 1761 4 0 30 0 0'
  fs.writeFile("./Feature.data", feature_data, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  }); 
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
