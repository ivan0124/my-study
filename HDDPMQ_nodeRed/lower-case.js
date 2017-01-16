module.exports = function(RED) {

    var mqtt = require('mqtt');

    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);

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
	  node.client = mqtt.connect('mqtt://172.22.212.92');
	  node.client.queueQoSZero = false;
	  node.client.on('connect', function () {
	    console.log('[HDDPMQ] node.clinet.on--> connected');
            node.status({fill:"green",shape:"dot",text:"connected"});
	  });
	}

        node.connect();
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}
