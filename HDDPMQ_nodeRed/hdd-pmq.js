module.exports = function(RED) {

    var mqtt = require('mqtt');

    function HddPmqNode(config) {
        RED.nodes.createNode(this,config);
        //console.log('createNode ========================> ');

        var node = this;
        this.status({fill:"red",shape:"dot",text:"disconnected"});

        this.on('input', function(msg) {
            //msg.payload = msg.payload.toLowerCase();
            console.log('name========================> ' + config.name);
            console.log('mqtt broker IP ========================> ' + config.mqttBrokerIP);
            //node.send(msg);
        });

	this.connect = function () {
	  console.log('[HDDPMQ] node connecting...');
	  node.client = mqtt.connect('mqtt://' + config.mqttBrokerIP);
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
            node.client.end();
            //node.status({fill:"red",shape:"dot",text:"disconnected"});
          });

          node.client.on('error', function (error) {
	    console.log('[HDDPMQ] node.clinet.on--> error');
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

        node.connect();
    }
    RED.nodes.registerType("hdd-pmq", HddPmqNode);
}
