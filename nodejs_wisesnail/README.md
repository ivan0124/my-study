#How to setup modules

1.setup modules in the `nodejs_wisesnail` directory and save it in the dependencies list. For example:
<pre>
$ cd  ~nodejs_wisesnail
$ npm install mqtt --save
$ npm install keypress -- save
</pre>

#Folder/File mapping introduction
1. Folder/File naming rule is using prefix `VGW_` or `CONN_` or `SENSORHUB_` + device MAC address 

![result link](https://github.com/ivan0124/my-study/blob/master/nodejs_wisesnail/images/20161011_nodejs_wisesnail_1.png)

#How to test
1. add device by adding folder and files.  
2. modify MQTT broker address in `mqtt_server.conf`
3. Launch wisesnail
<pre>
$node wisesnail.js
</pre>
