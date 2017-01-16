module.exports = function(RED) {

    var mqtt = require('mqtt');

    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        console.log('createNode ========================> ');

        var node = this;
        this.status({fill:"red",shape:"dot",text:"disconnected"});

        this.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            console.log('name========================> ' + config.name);
            console.log('my_test ========================> ' + config.test);
            node.send(msg);
        });

	this.connect = function () {
	  console.log('[HDDPMQ] node connecting...');
	  node.client = mqtt.connect('mqtt://' + config.test);
	  node.client.queueQoSZero = false;
          //node.client.setMaxListeners(0);

	  node.client.on('connect', function () {
	    console.log('[HDDPMQ] node.clinet.on--> connected');
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

	}

        node.connect();
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}
