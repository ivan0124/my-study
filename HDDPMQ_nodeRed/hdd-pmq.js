module.exports = function(RED) {

    var mqtt = require('mqtt');

    function HddPmqNode(config) {
        RED.nodes.createNode(this,config);
        //console.log('createNode ========================> ');

        var node = this;
        this.status({fill:"red",shape:"dot",text:"disconnected"});

        this.on('input', function(msg) {
            console.log('name========================> ' + config.name);
            console.log('mqtt broker IP ========================> ' + config.mqttBrokerIP);

            var deviceID = config.deviceID;
            var topic = '/cagent/admin/' + deviceID + '/deviceinfo';
            var msgObj ={};
            msgObj.susiCommData = {};
            msgObj.susiCommData.data = {};
            msgObj.susiCommData.data.HDDMonitor = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList.push({});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].BaseInfo = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].BaseInfo.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].BaseInfo.e.push({n:'hddName', sv: config.name});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature1 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature1.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature1.e.push({n:'type', v:5});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature1.e.push({n:'vendorData', sv: config.smart5});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature2 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature2.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature2.e.push({n:'type', v:9});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature2.e.push({n:'vendorData', sv: config.smart9});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature3 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature3.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature3.e.push({n:'type', v:198});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature3.e.push({n:'vendorData', sv: config.smart198});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature4 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature4.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature4.e.push({n:'type', v:197});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature4.e.push({n:'vendorData', sv: config.smart197});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature5 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature5.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature5.e.push({n:'type', v:187});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature5.e.push({n:'vendorData', sv: config.smart187});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature6 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature6.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature6.e.push({n:'type', v:194});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature6.e.push({n:'vendorData', sv: config.smart194});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature7 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature7.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature7.e.push({n:'type', v:193});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature7.e.push({n:'vendorData', sv: config.smart193});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature8 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature8.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature8.e.push({n:'type', v:192});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature8.e.push({n:'vendorData', sv: config.smart192});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature9 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature9.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature9.e.push({n:'type', v:199});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature9.e.push({n:'vendorData', sv: config.smart199});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature10 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature10.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature10.e.push({n:'type', v:191});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature10.e.push({n:'vendorData', sv: config.smart191});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature11 = {};
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature11.e = [];
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature11.e.push({n:'type', v:173});
            msgObj.susiCommData.data.HDDMonitor.hddSmartInfoList[0].Feature11.e.push({n:'vendorData', sv: config.smart173});

            //infoSpecObj.Info.e = [];
            //infoSpecObj.Info.e.push({n:'SenHubList', sv:'',asm:'r'});
            var message = JSON.stringify(msgObj);
            node.client.publish(topic, message);
        });

	this.connect = function () {
	  console.log('[HDDPMQ] node connecting...');
          var options = {};                                                      
          options.clientId = node.clientid;
          //options.clean = false;
	  //node.client = mqtt.connect('mqtt://' + config.mqttBrokerIP, {clientId: 'sub', clean: false});
	  node.client = mqtt.connect('mqtt://' + config.mqttBrokerIP, options);
	  node.client.queueQoSZero = false;
          //node.client.setMaxListeners(0);
         

	  node.client.on('connect', function () {
	    console.log('[HDDPMQ] node.clinet.on--> connected');
            node.client.subscribe('/cagent/admin/+/eventnotify');
            node.status({fill:"green",shape:"dot",text:"connected"});
	  });

	  node.client.on('reconnect', function () {
	    console.log('[HDDPMQ] node.clinet.on--> reconnect');
            node.status({fill:"yellow",shape:"dot",text:"connecting..."});
	  });

          node.client.on('close', function () {
	    console.log('[HDDPMQ] node.clinet.on--> close');
            //node.client.end();
            node.status({fill:"red",shape:"dot",text:"disconnected"});
          });
/*
          node.client.once('close', function () {
	    console.log('[HDDPMQ] node.clinet.once--> close');
            node.client.end();
            node.status({fill:"red",shape:"dot",text:"disconnected"});
          });
*/
          node.client.on('error', function (error) {
	    console.log('[HDDPMQ] node.clinet.on--> error');
            //node.client.end();
            node.status({fill:"red",shape:"dot",text:"disconnected"});
          });

	  node.client.on('message', function (topic, message) {
            console.log('--------------------------------------------------------------');
            console.log('topic=' + topic.toString() );
            console.log('msg=' + message.toString());
            console.log('--------------------------------------------------------------');
            var msg={};
            msg.payload = message.toString();
            node.send(msg);
	  });

	}

        this.on('close', function(done) {
	  console.log('[HDDPMQ] node-red node on--> close');
          node.client.end('force', function(){
	     console.log('[HDDPMQ] node-red node on =======>  close done');
             done();
          });
        });

	//console.log('[HDDPMQ] node.connect =========>');
        node.connect();
    }
    RED.nodes.registerType("hdd-pmq", HddPmqNode);
}
