#How to setup modules

1.setup modules in the `nodejs_wisesnail` directory and save it in the dependencies list. For example:
<pre>
$ cd  ~nodejs_wisesnail
$ npm install mqtt --save
$ npm install keypress -- save
</pre>

#How to test
1. modify MQTT broker address in `mqtt_server.conf`
2. Launch wisesnail
<pre>
$node wisesnail.js
</pre>

