var mqtt = require('mqtt');
var fs = require('fs');
var spawn = require('child_process').spawn

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
  console.log('mqtt connect to ' + mqtt_server );
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

  var outputObj = {};
  outputObj.featureList = 'failure ';
  outputObj.featureVal = '1 ';

  getFeatureObj( jsonObj, outputObj );
  console.log('featureList =' + outputObj.featureList);
  console.log('featureVal =' + outputObj.featureVal);

  console.log('----------------------------------------------------------------------------');
  
  //sendToMqttBroker('/ML_HDD/12345/predict_result', 'ML_model response');
  
  //var feature_data ='failure smart5 smart9 smart187 smart192 smart194 smart197 smart198\n1 8 1761 4 0 30 0 0'
  var feature_data = outputObj.featureList +'\n' + outputObj.featureVal;
  fs.writeFile("./Feature.data", feature_data, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });

  /****************/
  var env = process.env
  var opts = { cwd: './',
               env: process.env
             }

  var RCall = ['--no-restore','--no-save','PredictionModel.R','111,222,333']
  var R  = spawn('Rscript', RCall, opts)

  R.on('exit',function(code){
    console.log('got exit code: '+code)
    if(code==1){
            // do something special
    }else{
    }
    return null
  })

  R.stdout.on('data', (data) => {
    console.log('stdout:' + data);
    var responsObj = {};
    responsObj = JSON.parse(data);
    responsObj.SessionID = 12345;

    sendToMqttBroker('/ML_HDD/12345/predict_result', JSON.stringify(responsObj));
  });
})

function sendToMqttBroker(topic, message){
  
  console.log('--------------------------send mqtt message------------------------------');
  console.log('topic=' + topic.toString() );
  console.log('msg=' + message.toString());
  console.log('-------------------------------------------------------------------------');
  
  client.publish(topic, message);
}


function getFeatureObj( jsonObj, outputObj ){
  
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      console.log( 'key =======>' + key + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key]));
      if ( key === 'smart5' || key === 'smart9' || key === 'smart187' ||
           key === 'smart192' || key === 'smart194' || key === 'smart197' ||
           key === 'smart198' ){
        outputObj.featureList += key;
        outputObj.featureList += ' ';
        outputObj.featureVal += JSON.stringify(jsonObj[key]);
        outputObj.featureVal += ' ';
      }
    }
  }
  //
  for (key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      if (typeof jsonObj[key] === 'object' ){
        getFeatureObj( jsonObj[key], outputObj);
      }
    }
  }

  return;

}

