module.exports = function(RED) {
    ML_param="0,0,0"
    function MyPLANode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            //msg.payload = msg.payload.toLowerCase();
            //msg.payload = "123";
            submsg="[DEFAULT]";
            if ( msg.payload.indexOf(submsg) != -1){
                //console.log("msg.payload=" + msg.payload);
                //console.log("!!!!!!!!!!!!!!!!!");
                param=msg.payload.split("=");
                ML_param=param[1];
                msg.payload = "[NodeRed] set PLA ML_param=" + ML_param;
                node.send(msg);
                return;
            }
            //console.log(process.cwd());

            var PythonShell = require('python-shell');
            var options = {
                scriptPath: './',
                args: [ msg.payload, ML_param ]
            };
            var pyshell = new PythonShell('pla.py', options);

            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                //console.log('my-PLA:');
                console.log(message);
                //var colors=require('colors/safe');
                var array=message.split(",");
                console.log(array[1]);
                if (array[1] == 1){
                    msg.payload = "[Status OK]: " + array[0]+",w="+array[2];
                }
                else if (array[1] == -1){
                    msg.payload = "[Status WARNING!!!]: " + array[0]+",W="+array[2];
                }
                node.send(msg);
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) throw err;
                //console.log('my-PLA:finished');
            });

            //node.send(msg);
        });
    }
    RED.nodes.registerType("my-PLA",MyPLANode);
}
