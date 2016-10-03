var express = require('express');
var greetings = require("./greetings.js");
var ws_data = require('./wise_snail_data.js');
var HashMap = require('hashmap').HashMap;
var map = new HashMap();
var app = express();
//Mqtt
var mqtt = require('mqtt');
//var client  = mqtt.connect('mqtt://test.mosquitto.org');
var client  = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', function () {
  console.log('hello.js mqtt connect !!!!');
  client.subscribe('presence');
  client.publish('agentinfo', 'Hello mqtt');
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  //client.end()
})


app.get('/', function (req, res) {
  // "Hello"
  greetings.sayHelloInEnglish();
  console.log('~~~~~~~~!!!!');
  // "Hola"  
  greetings.sayHelloInSpanish();  
  res.send('Hello World!');
});

app.get('/wise_snail_data', function (req, res) {
  ws_data.set_connectivity();
  client.publish('agentinfo', 'Hello WiseSnail Data');
  res.send('Hello WiseSnail Data!');
});

app.get('/get_wise_snail_data', function (req, res) {
  ws_data.get_connectivity();
  res.send('Get WiseSnail Data!');
});

app.get('/vgw_agentinfoack', function (req, res) {
  client.publish('/cagent/admin/0000000E4CABCDEF/agentinfoack', '{\"susiCommData\":{\"devID\":\"0000000E4CABCDEF\",\"parentID\":\"\",\
\"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCDEF\",\"mac\":\"000E4CABCDEF\",\"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
\"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\"requestID\":21,\"agentID\":\"0000000E4CABCDEF\",\
\"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}');
  res.send('vgw_agentinfoack');
});

app.get('/vgw_willmessage', function (req, res) {
  client.publish('/cagent/admin/0000000E4CABCDEF/agentinfoack', '{\"susiCommData\":{\"devID\":\"0000000E4CABCDEF\",\"parentID\":\"\",\
\"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCDEF\",\"mac\":\"000E4CABCDEF\",\"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
\"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\"requestID\":21,\"agentID\":\"0000000E4CABCDEF\",\
\"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}');
  res.send('vgw_willmessage');
});


function myTest( jsonObj ){
  
     for (key in jsonObj) {
       if (jsonObj.hasOwnProperty(key)) {
           if ( typeof jsonObj[key] === 'object' ){
               console.log(key + " G===> " + jsonObj[key] + " ,type = " + Object.prototype.toString.call(jsonObj));
               //console.log(key + " G===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
           }
           //console.log(" type = " + typeof jsonObj[key]);
           for (key2 in jsonObj[key]) {
               if ( typeof jsonObj[key][key2] === 'object' ){
                   console.log(   key2 + " G======> " + jsonObj[key][key2] + " ,type = " + typeof jsonObj[key][key2]);
               }
               //console.log(" type = " + typeof jsonObj[key][key2]);
           }
       }
    }  
}

function listObj( i, keyStr, jsonObj ){
  console.log( 'listObj Start-------------------------------------------------');
  for (key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
          //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
          //if (typeof jsonObj[key] === 'object' ){
              console.log( 'keyStr=======>' + keyStr + '/' + key + ', keyVal=======>' + jsonObj[key]);
          //}
          //else{
              //console.log( 'keyStr=======>' + keyStr + '/' + key);
          //}
      }
   }
 //
  for (key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
          //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
          if (typeof jsonObj[key] === 'object' ){
              listObj( i, keyStr + '/' + key, jsonObj[key]);
          }
          else{
              //console.log( 'listObj return -------------------------------------------------key=' + key);
              //return;
          }
      }
   }  
  
   console.log( 'listObj return -------------------------------------------------key=' + key);
   return;  
 /*
   if ( i > 3){
       return ;         
   }
   else{
       i++;
       console.log( 'listObj-------------------------------------------------key=' + key);
       listObj( i, keyStr + '/' + key, jsonObj[key]);
   }
   */
}

app.get('/restapi/susiCommData/infoSpec/IoTGW', function (req, res) { 
  
  //
  console.log("original URL="+req.originalUrl);
  var arr = req.originalUrl.split("/");
  var cmdString;
  for (var i=0; i < arr.length ; i++){
      console.log("arr="+arr[i]);
      if ( i >=2 ){
          if ( i==2 ){
              cmdString=arr[2];
          }
          else{
              cmdString+=".";
              cmdString+=arr[i];
          }
      }
  }
  console.log("cmdString="+cmdString);
  //
  var jsonString = "{\"key\":\"value\"}";
  var jsonObj = JSON.parse(jsonString);
  console.log(jsonObj.key);
  //
  var susiString = "{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"WSN\":{\"WSN0\":{\"Info\":\
                    {\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                    {\"n\":\"Name\",\"sv\":\"WSN0\",\"asm\":\"r\"},{\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                    {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},{\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
                    \"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\"bn\":\"WSN\",\"ver\":1},\"ver\":1}},\
                    \"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\"handlerName\":\"general\",\
                    \"sendTS\":160081020}}";
   var susiObj = JSON.parse(susiString);
   
   //
   var aStr="susiCommData";
   var bStr="sendTS";
   var cStr="infoSpec";
   console.log(" susiCommData.sendTS ----------------> " + susiObj[aStr][bStr] + ",type = " + typeof susiObj[aStr][bStr]);
  
   console.log(" susiCommData.infoSpec ----------------> " + susiObj[aStr][cStr] + ", type = " + typeof susiObj[aStr][cStr]);
   //
   //myTest( susiObj );
   listObj(0, '/restapi', susiObj);
  /*
   for (key in susiObj) {
       if (susiObj.hasOwnProperty(key)) {
           console.log(key + " ===> " + susiObj[key] + " ,type = " + typeof susiObj[key]);
           //console.log(" type = " + typeof susiObj[key]);
           for (key2 in susiObj[key]) {
               console.log(   key2 + " ======> " + susiObj[key][key2] + " ,type = " + typeof susiObj[key][key2]);
               //console.log(" type = " + typeof susiObj[key][key2]);
           }
       }
   }
   */
   //
   console.log("Object.keys(susiObj)[0]="+Object.keys(susiObj)[0]); 
    Object.keys(susiObj).forEach(function(k) {
        console.log("k="+k); 
    });

   //
   //var string = JSON.stringify(susiObj.susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e[0]);
   var string = JSON.stringify(susiObj["susiCommData"]["infoSpec"]);
   console.log("string="+string); 
  
  console.log(typeof susiObj["susiCommData"]["infoSpec"]["IoTGW"]["WSN"]["WSN0"]["Info"]); 
  
   var myStr="susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e";
   for (var i = 0; i < susiObj.susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e.length; i++) { 
       //console.log(susiObj.susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e[i]); 
       console.log(susiObj["susiCommData"]["infoSpec"]["IoTGW"]["WSN"]["WSN0"]["Info"]["e"][i]); 
   }
   //
   console.log("-------------------------------------------------------"); 
   var eObj=susiObj["susiCommData"]["infoSpec"]["IoTGW"]["WSN"]["WSN0"]["Info"]["e"];
   for (key in eObj) {
       if (eObj.hasOwnProperty(key)) {
           console.log(key + " ===> " + eObj[key] + " ,type = " + typeof eObj[key]);
       }
   }
   //mqtt publish
   client.publish('presence', '===== Mqtt RESTful publish===');
   //   
   res.send(susiString);
  
});

app.get('/sethash', function (req, res) { 
  
  var arr=[];
  arr.push('aaaaa');
  arr.push('bbbbb');
  console.log('arr[0]=' + arr[0] + ',arr[1]=' + arr[1] + ',arr length=' + arr.length);
  //
  //var cat1 = {colour: "red", name: "Spot1", size: 46};
  var sensor_hub_map = new HashMap();
  var sensor1 = {id: '123', cap: 'gggg' };
  sensor_hub_map.set('123', sensor1);
  //
  var cat1 = {colour: 'red', name: sensor_hub_map, size: 46};
  //cat1.name.push('cccc');
  //cat1.name.push('dddd');
  var tmp_sen=cat1.name.get('123');
  console.log('tmp_sen.id=' + tmp_sen.id + ',tmp_sen.cap=' + tmp_sen.cap );
  //
  /*
  var cat1 = {colour: 'red', name: [], size: 46};
  cat1.name.push('cccc');
  cat1.name.push('dddd');
  console.log('cat1.name[0]=' + cat1.name[0] + ',cat1.name[1]=' + cat1.name[1] + ',cat1.name length=' + cat1.name.length);
  */
  //
  var cat2 = {colour: 'blue', name: 'Spot2', size: 36};
  var cat3 = {colour: 'green', name: 'Spot3', size: 26};
  //
  var connectivity={ gateway_id:'null', capability:'null', sensor_hub: [] };
  //
  map.set('key1', cat1);
  map.set('key2', cat2);
  map.set('key3', cat3);
  
  res.send('/set/Hello World!');
});

app.get('/gethash', function (req, res) {
  
  var cat=map.get('key1');
  if (typeof cat != 'undefined') {
      console.log('get cat.colour='+cat.colour);  
      cat.colour='gray';
  }
  //
  map.forEach(function(obj, key) {
      if (typeof obj !== 'undefined') {
          console.log(key + ' : ' + obj.colour);
      }
  });  
  res.send('/get/Hello World!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
