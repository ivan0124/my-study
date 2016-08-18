module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            //msg.payload = msg.payload.toLowerCase();
            msg.payload = "123";
            console.log('my test');
            console.log(process.cwd());

            var PythonShell = require('python-shell');
            var options = {
                scriptPath: '/mnt/my-study/NodeRed_call_python',
                args: ['value1', 'value2', 'value3']
            };
            var pyshell = new PythonShell('hello.py', options);

            // sends a message to the Python script via stdin
            //pyshell.send('777');

            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                console.log('my message:');
                console.log(message);
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) throw err;
                console.log('my_test:finished');
            });
/*
            PythonShell.run('hello.py', function (err) {
                if (err) throw err;
                console.log('finished');
            });
*/
            node.send(msg);
        });
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}
