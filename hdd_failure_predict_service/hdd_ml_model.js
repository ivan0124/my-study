var mqtt = require('mqtt');
var fs = require('fs');
var HashMap = require('hashmap').HashMap;
var AlertRecoredMap = new HashMap();
var PredictRecordMap = new HashMap();
var spawnSync = require('child_process').spawnSync
var keypress = require('keypress');
var ffi = require('ffi');
var ref = require('ref');
var arrayType = require('ref-array');

console.log('require nodejs module done');

const HEALTH = {
                  GOOD:0,
                  SICK:1 
               };

const RECORD_OBJ = { 
                     notified: true,
                     alert_warning: '',
                     alert_warning_count: 0,
                     predict_health: '',
                     predict_notify_count: 0,
                   }; 

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
  client.subscribe('/cagent/admin/+/deviceinfo');

  //sendToMqttBroker('/ML_HDD/12345/predict_result', 'ML_model response');
})


client.on('message', function (topic, message) {
  
  try {
      var jsonObj = JSON.parse(message.toString());
  } catch (e) {
      console.error(e);
      return;
  }

  if ( typeof jsonObj.susiCommData === 'undefined' ){
    return;
  }
  if ( typeof jsonObj.susiCommData.data === 'undefined' ){
    return;
  }
  if ( typeof jsonObj.susiCommData.data.HDDMonitor === 'undefined' ){
    return;
  }
  if ( typeof jsonObj.susiCommData.data.HDDMonitor.hddSmartInfoList === 'undefined' ){
    return;
  }

  console.log('--------------------------receive mqtt message------------------------------');
  console.log('topic=' + topic.toString() );
  console.log('msg=' + message.toString());
  var deviceID = topic.toString().split('/')[3];

  //var responsObj = {};
  //responsObj.disk = [];

  var hddNum = jsonObj.susiCommData.data.HDDMonitor.hddSmartInfoList.length;
  console.log('hddNum = ' + hddNum);
  for (var i = 0; i < hddNum; i++) { 
    //console.log(jsonObj["susiCommData"]["data"]["HDDMonitor"]["hddSmartInfoList"][i]); 
    var responsObj = {};
    predict(deviceID, jsonObj["susiCommData"]["data"]["HDDMonitor"]["hddSmartInfoList"][i], responsObj);
    if ( isNeedSendNotifyEvent(deviceID, responsObj) === true ){
      sendToMqttBroker('/cagent/admin/'+ deviceID + '/eventnotify', JSON.stringify(responsObj));
    }
    else{
      console.log('========> do not send NotifyEvent')
    }
  }

})


function isNeedSendNotifyEvent( deviceID, responsObj ){

  if ( isNeedSendAlertNotifyEvent( deviceID, responsObj) === true ||
       isNeedSendPredictNotifyEvent( deviceID, responsObj) === true ){
    return true;
  }

  return false;
}

function isNeedSendPredictNotifyEvent( deviceID, responsObj ){

  var key=deviceID + responsObj.susiCommData.eventnotify.extMsg.predictMsg.deviceName;
  if ( PredictRecordMap.has(key) === false ){
    if ( responsObj.susiCommData.eventnotify.extMsg.predictMsg.health  === 'Sick' ){
      var record = JSON.parse(JSON.stringify(RECORD_OBJ));
      record.predict_health = 'Sick'; 
      record.predict_notify_count += 1;
      console.log( 'RRR record.predict_notify_count = ' + record.predict_notify_count);
      PredictRecordMap.set(key, record );
      return true;
    }
  }
  else{
    if ( responsObj.susiCommData.eventnotify.extMsg.predictMsg.health  === 'Sick'){
      var record = PredictRecordMap.get(key);
      console.log( '>>> record.predict_notify_count = ' + record.predict_notify_count);
      if ( record.predict_notify_count <= 3 ){
        record.predict_notify_count += 1;
        console.log( '!!! record.predict_notify_count = ' + record.predict_notify_count);
        return true;
      }
      else{
        return false;
      }
    }
    else{
      PredictRecordMap.remove(key);
      return true;
    }

    return false;  
  }

  return false;
}

function isNeedSendAlertNotifyEvent( deviceID, responsObj ){

  var key=deviceID + responsObj.susiCommData.eventnotify.extMsg.alertMsg.deviceName;
  if ( AlertRecoredMap.has(key) === false ){
    if ( responsObj.susiCommData.eventnotify.extMsg.alertMsg.warning === 'Yes' ){
      var record = JSON.parse(JSON.stringify(RECORD_OBJ));
      record.alert_warning = 'Yes'; 
      record.alert_warning_count += 1;
      console.log( 'RRR record.alert_warning_count = ' + record.alert_warning_count);
      AlertRecoredMap.set(key, record );
      return true;
    }
  }
  else{
    if ( responsObj.susiCommData.eventnotify.extMsg.alertMsg.warning === 'Yes' ){
      var record = AlertRecoredMap.get(key);
      console.log( '>>> record.alert_warning_count = ' + record.alert_warning_count);
      if ( record.alert_warning_count <= 3 ){
        record.alert_warning_count += 1;
        console.log( '!!! record.alert_warning_count = ' + record.alert_warning_count);
        return true;
      }
      else{
        return false;
      }
    }
    else{
      AlertRecoredMap.remove(key);
      return true;
    }

    return false;  
  }

  return false;
}

function getPredictSuggestion( diskObj, predictSuggestion, predictMsg ){
  
  predictMsg.msg = 'HDD ';

  if ( diskObj.smart5 > 10 ||  diskObj.smart197 > 2){
    predictSuggestion.push('Please reduce the ambient temperature to 40 °C or less');
    predictSuggestion.push('Please reduce the long-term use in dynamic vibration environment');

    if ( diskObj.smart5 > 10 ){
      predictMsg.msg = predictMsg.msg + 'smart5 ';
    }
    if ( diskObj.smart197 > 2 ){
      predictMsg.msg = predictMsg.msg + 'smart197 ';
    }

  }

  if ( diskObj.smart9 > 26280 || diskObj.smart187 > 1 || diskObj.smart192 > 190 ){
    predictSuggestion.push('Please back up the hard disk as soon as possible (within 30 days)');
    
    if ( diskObj.smart9 > 26280 ){
      predictMsg.msg = predictMsg.msg + 'smart9 ';
    }
    if ( diskObj.smart187 > 1 ){
      predictMsg.msg = predictMsg.msg + 'smart187 ';
    }
    if ( diskObj.smart192 > 190 ){
      predictMsg = predictMsg + 'smart192 ';
    }
  }

  if ( diskObj.smart192 > 190 ){
    predictSuggestion.push('Please avoid abnormal power failure again');

    if ( diskObj.smart192 > 190 ){
      predictMsg.msg = predictMsg.msg + 'smart192 ';
    }
  }

  predictMsg.msg = predictMsg.msg + 'over the threshold.';
}

function getAlertSuggestion( alertObj, alertSuggestion ){

  if ( alertObj.Alert1 > 20 ){
    alertSuggestion.push('Please check CABLE connection');
  }

  if ( alertObj.Alert1 > 20 || alertObj.Alert2 > 10 || alertObj.Alert4 > 10 || alertObj.Alert7 > 65){
    alertSuggestion.push('Please reduce the ambient temperature to 40 °C or less');
  }

  if ( (alertObj.Alert2 > 10 && alertObj.Alert3 < 10) ||
       (alertObj.Alert5 < 10 && alertObj.Alert4 > 10) ){
    alertSuggestion.push('Please try reboot system first');
  }

  if ( alertObj.Alert3 > 10 && alertObj.Alert2 > 10 ){
    alertSuggestion.push('Please back up the hard disk as soon as possible (within 30 days)');
  }

  if ( (alertObj.Alert5 > 10  && alertObj.Alert4 > 10) ||
        alertObj.Alert6 > 30 || alertObj.Alert4 > 10 || alertObj.Alert2 > 10){
    alertSuggestion.push('Please reduce the long-term use in dynamic vibration environment');
  }

  if ( alertObj.Alert7 > 65 ){
    alertSuggestion.push('Make sure the fan / cooling system is working properly');
  }

  if ( alertObj.Alert8 < 0 ){
    alertSuggestion.push('Make sure that the ambient temperature is within the range of 0 to 40 °C');
  }

  if ( alertObj.Alert9 > 3000 ){
    alertSuggestion.push('Please back up hard disk data as soon as possible (within 7 days)');
  }
}

function predict( deviceID, jsonObj, responsObj){

  var outputObj = {};
  var featureList = 'failure smart5 smart9 smart187 smart192 smart197';
  outputObj.smart5 = '0';
  outputObj.smart9 = '0';
  outputObj.smart187 = '0';
  outputObj.smart192 = '0';
  outputObj.smart194 = '0';
  outputObj.smart197 = '0';
  outputObj.smart198 = '0';
  outputObj.smart199 = '0';
  outputObj.smart191 = '0';
  outputObj.smart173 = '0';

  var inputObj = jsonObj;
  var baseInfoObj = jsonObj.BaseInfo;
  var hddName;
  //console.log(baseInfoObj);

  /* get hddName */
  for (var i = 0; i < baseInfoObj["e"].length; i++) {

    if ( baseInfoObj["e"][i].n === 'hddName'){
      //console.log('============ baseInfoObj.e i= ' + i);
      console.log('hddName => baseInfoObj["e"]['+ i +'].sv = ' + baseInfoObj["e"][i].sv);
      hddName = baseInfoObj["e"][i].sv;
    } 
  }

  //var inputObj = jsonObj.susiCommData.data.HDDMonitor;
  //console.log('input msg=' + JSON.stringify(inputObj));

  getFeatureObj( inputObj, outputObj );
  var featureVal = '0 ' + outputObj.smart5 + ' ' + outputObj.smart9 + ' ' + outputObj.smart187 + ' ' + outputObj.smart192 + ' ' + ' ' + outputObj.smart197 ; 
  console.log('featureList =' + featureList);
  console.log('featureVal =' + featureVal);
 
  /* Alert1 value */ 
  var alert_1 = 0;
  if ( parseInt(outputObj.smart9 , 10) !== 0 ){
    alert_1 = parseInt(outputObj.smart199 , 10)/parseInt(outputObj.smart9 , 10);
  }
  console.log('Alert1 = ' + alert_1);
  /* Alert2 value */ 
  var alert_2 = 0;
  if ( parseInt(outputObj.smart9 , 10) !== 0 ){
    alert_2 = parseInt(outputObj.smart5 , 10)/parseInt(outputObj.smart9 , 10);
  }
  console.log('Alert2 = ' + alert_2);
  /* Alert3 value */ 
  var alert_3 = 0;
  if ( parseInt(outputObj.smart9 , 10) !== 0 ){
    alert_3 = parseInt(outputObj.smart187 , 10)/parseInt(outputObj.smart9 , 10);
  }
  console.log('Alert3 = ' + alert_3);
  /* Alert4 value */ 
  var alert_4 = 0;
  if ( parseInt(outputObj.smart9 , 10) !== 0 ){
    alert_4 = parseInt(outputObj.smart197 , 10)/parseInt(outputObj.smart9 , 10);
  }
  console.log('Alert4 = ' + alert_4);
  /* Alert5 value */ 
  var alert_5 = 0;
  if ( parseInt(outputObj.smart9 , 10) !== 0 ){
    alert_5 = parseInt(outputObj.smart198 , 10)/parseInt(outputObj.smart9 , 10);
  }
  console.log('Alert5 = ' + alert_5);
  /* Alert6 value */ 
  var alert_6 = 0;
  if ( parseInt(outputObj.smart9 , 10) !== 0 ){
    alert_6 = parseInt(outputObj.smart191 , 10)/parseInt(outputObj.smart9 , 10);
  }
  console.log('Alert6 = ' + alert_6);
  /* Alert7 value */ 
  var alert_7 = parseInt(outputObj.smart194 , 10);
  console.log('Alert7 = ' + alert_7);
  /* Alert8 value */ 
  var alert_8 = parseInt(outputObj.smart194 , 10);
  console.log('Alert8 = ' + alert_8);
  /* Alert9 value */ 
  var alert_9 = parseInt(outputObj.smart173 , 10);
  console.log('Alert9 = ' + alert_9);
  
  /****************/
  //var feature_data ='failure smart5 smart9 smart187 smart192 smart194 smart197 smart198\n1 8 1761 4 0 30 0 0'
/*
  var feature_data = featureList +'\r\n' + featureVal + '\r\n';
  fs.writeFileSync("./Feature.data", feature_data);

  var env = process.env
  var opts = { cwd: './',
               env: process.env,
               stdio: 'pipe',
               encoding: 'utf-8'
             }

  var RCall = ['--no-restore','--no-save','PredictionModel.R','111,222,333']
  var R  = spawnSync('Rscript', RCall, opts)
  console.log('-------------------------------------------------------------------------');
  console.log('['+hddName+'] predicton result:');
  console.log(R.stdout);
*/
  /***********/
  var int = ref.types.int
  var double = ref.types.double
  var intArray = arrayType(int)
  var doubleArray = arrayType(double)

  var libm = ffi.Library('./hddPredict.so', {
    'hddPredict': [ 'int', [ 'int', intArray] ]
  });

  var hdd_smart = new intArray(6)
  hdd_smart[0] = 1      //for intercept
  hdd_smart[1] = parseInt(outputObj.smart5 , 10) //smart 5
  hdd_smart[2] = parseInt(outputObj.smart9 , 10)  //smart 9
  hdd_smart[3] = parseInt(outputObj.smart187 , 10)   //smart 187
  hdd_smart[4] = parseInt(outputObj.smart192 , 10)     //smart 192
  hdd_smart[5] = parseInt(outputObj.smart197 , 10)    //smart 197

  var r =libm.hddPredict(hdd_smart.length, hdd_smart);
  //console.log("hddPredict.so return: " + r);
  //var predict_result = '{"Prediction":{"Health" :' + r + ', "Model Accuracy": "82.5%", "Model version" : "v0.0.8" }}';
  var predict_result = '{"Prediction":{"Health" :' + r + '}}';
  console.log(predict_result);
  /***********/

  var diskObj ={};
  diskObj = JSON.parse(predict_result);
  diskObj['hddName'] = hddName;
  diskObj['smart5'] = parseInt(outputObj.smart5 , 10);
  diskObj['smart9'] = parseInt(outputObj.smart9 , 10);
  diskObj['smart187'] = parseInt(outputObj.smart187 , 10);
  diskObj['smart192'] = parseInt(outputObj.smart192 , 10);
  diskObj['smart197'] = parseInt(outputObj.smart197 , 10);
  diskObj['Alert1'] = alert_1;
  diskObj['Alert2'] = alert_2;
  diskObj['Alert3'] = alert_3;
  diskObj['Alert4'] = alert_4;
  diskObj['Alert5'] = alert_5;
  diskObj['Alert6'] = alert_6;
  diskObj['Alert7'] = alert_7;
  diskObj['Alert8'] = alert_8;
  diskObj['Alert9'] = alert_9;

  //console.log('diskObj Health =' + diskObj.Prediction.Health);
  //push prediction suggestion
  var predictSuggestion=[];
  var predictMsg = {};
  predictMsg.msg='';
  if ( diskObj.Prediction.Health === HEALTH.SICK ){
    //console.log('HDD is sick');
    getPredictSuggestion( diskObj, predictSuggestion, predictMsg );
    //console.log('predictMsg.msg =' + predictMsg.msg);
  }

  //push alert suggestion
  var alertSuggestion=[];
  getAlertSuggestion(diskObj,alertSuggestion);
  //
  //if ( alertSuggestion.length !== 0 ){
  responsObj.susiCommData = {};
  responsObj.susiCommData.commCmd = 0;
  responsObj.susiCommData.requestID = 0;
  responsObj.susiCommData.agentID = "";
  responsObj.susiCommData.handlerName = "general";
  responsObj.susiCommData.sendTS = 0;
  responsObj.susiCommData.eventnotify = {};
  responsObj.susiCommData.eventnotify.subtype = "predictInfo";
  if ( diskObj.Prediction.Health === HEALTH.SICK ){
    responsObj.susiCommData.eventnotify.subtype = "predictError";
  }
  responsObj.susiCommData.eventnotify.msg = predictMsg.msg;
  responsObj.susiCommData.eventnotify.severity = 2;
  responsObj.susiCommData.eventnotify.handler = "MsgGen";
  responsObj.susiCommData.eventnotify.extMsg = {};
  responsObj.susiCommData.eventnotify.extMsg.predictMsg = {};
  responsObj.susiCommData.eventnotify.extMsg.predictMsg.health = "Good";

  if ( diskObj.Prediction.Health === HEALTH.SICK ){
    responsObj.susiCommData.eventnotify.extMsg.predictMsg.health = "Sick";
  
    if ( predictSuggestion.length !== 0 ){

      for ( var i=0 ; i < predictSuggestion.length ; i++){
        var keyName = 'suggestion' + i;
        responsObj.susiCommData.eventnotify.extMsg.predictMsg[keyName] = predictSuggestion[i];
      }
    }
  }
  responsObj.susiCommData.eventnotify.extMsg.predictMsg.deviceName = hddName;

  responsObj.susiCommData.eventnotify.extMsg.alertMsg = {};
  responsObj.susiCommData.eventnotify.extMsg.alertMsg.warning = "No";

  if ( alertSuggestion.length !== 0 ){
    responsObj.susiCommData.eventnotify.extMsg.alertMsg.warning = "Yes";

    for ( var i=0 ; i < alertSuggestion.length ; i++){
      var keyName = 'suggestion' + i;
      responsObj.susiCommData.eventnotify.extMsg.alertMsg[keyName] = alertSuggestion[i];
    }

  }
  responsObj.susiCommData.eventnotify.extMsg.alertMsg.deviceName = hddName;
  //responsObj.susiCommData.eventnotify.extMsg = diskObj;
  
  console.log('-------------------------------------------------------------------------');

}

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
      //console.log( 'key =======>' + key + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key]));
      if ( key === 'e' ){
        console.log( '=============================================================>');
        var currentSmartID = '';
        for (var i = 0; i < jsonObj[key].length; i++) { 
          //console.log( 'key =======>' + key + ', jsonKeyVal=======>' + JSON.stringify(jsonObj[key][i]));
          if( jsonObj[key][i]['n'] !== 'undefined' ){
            //console.log( '1 ====== ' + JSON.stringify(jsonObj[key][i]['n']));
            
            if ( JSON.stringify(jsonObj[key][i]['n']) === '"type"'){          
              console.log( 'SMART ID =======>' + JSON.stringify(jsonObj[key][i]['v']));
              currentSmartID = JSON.stringify(jsonObj[key][i]['v']).toString();
              //outputObj.smart194 = '123';
            }
            if ( JSON.stringify(jsonObj[key][i]['n']) === '"vendorData"'){
              var rawData =  JSON.stringify(jsonObj[key][i]['sv']);
              rawData = rawData.replace('"','');
              rawData = parseInt(rawData,16);          
              console.log( 'rawData =======>' + rawData);
              if ( currentSmartID === '5' ){
                outputObj.smart5 = rawData;
              }
              if ( currentSmartID === '9' ){
                outputObj.smart9 = rawData;
              }
              if ( currentSmartID === '187' ){
                outputObj.smart187 = rawData;
              }
              if ( currentSmartID === '192' ){
                outputObj.smart192 = rawData;
              }
              if ( currentSmartID === '194' ){
                outputObj.smart194 = rawData;
              }
              if ( currentSmartID === '197' ){
                outputObj.smart197 = rawData;
              }
              if ( currentSmartID === '198' ){
                outputObj.smart198 = rawData;
              }
              if ( currentSmartID === '199' ){
                outputObj.smart199 = rawData;
              }
              if ( currentSmartID === '191' ){
                outputObj.smart191 = rawData;
              }
              if ( currentSmartID === '173' ){
                outputObj.smart173 = rawData;
              }
            }
            
          }
        }
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

