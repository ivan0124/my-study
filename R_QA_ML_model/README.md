# install R environment

1.installing R: [how-to-set-up-r-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-set-up-r-on-ubuntu-14-04)
<pre>
$ sudo apt-get update
$ sudo apt-get -y install r-base
</pre>

# install nodejs module
<pre>
$ npm install mqtt --save
$ npm install keypress -- save
</pre>

#How to test
1. generate and save trained `Model.RData` file
<pre>
$ Rscript ./TrainModel.R
</pre>

2. load `Model.RData` and predict HDD `Feature.data`
<pre>
$ Rscript ./PredictionModel.R
</pre>

#Use NodeJS and Node-Red to test
1. launch HDD ML service:
<pre>
$ node ./hdd_ml_model.js
</pre>

2. import below node-red code as client to send data to HDD ML service.
<pre>
[{"id":"fe96f816.4a94a8","type":"mqtt out","z":"25827ce1.3df244","name":"ML_predict","topic":"/ML_HDD/12345/predict","qos":"0","retain":"","broker":"a6b7ff3c.2c927","x":416,"y":154,"wires":[]},{"id":"9e4445d2.4bc1a8","type":"inject","z":"25827ce1.3df244","name":"test data 1","topic":"/ML_HDD/12345/predict","payload":"{\"HDD_data\": {\"smart1\": 10,\"smart2\": 20,\"smart3\": 30, \"smart5\":8, \"smart9\":1761, \"smart187\":4, \"smart192\":0, \"smart194\":30, \"smart197\":0, \"smart198\":0},\"SessionID\":12345}","payloadType":"json","repeat":"","crontab":"","once":false,"x":139,"y":154,"wires":[["fe96f816.4a94a8"]]},{"id":"df8d44a7.d52868","type":"mqtt in","z":"25827ce1.3df244","name":"ML_predict_result","topic":"/ML_HDD/+/predict_result","qos":"0","broker":"a6b7ff3c.2c927","x":143,"y":239,"wires":[["c81505a.21205f8"]]},{"id":"c81505a.21205f8","type":"debug","z":"25827ce1.3df244","name":"","active":true,"console":"false","complete":"false","x":404,"y":239,"wires":[]},{"id":"a6b7ff3c.2c927","type":"mqtt-broker","z":"25827ce1.3df244","broker":"172.22.215.238","port":"1883","tls":null,"clientid":"","usetls":false,"compatmode":true,"keepalive":"60","cleansession":true,"willTopic":"","willQos":"0","willRetain":null,"willPayload":"","birthTopic":"","birthQos":"0","birthRetain":null,"birthPayload":""}]
</pre>

![image result](https://github.com/ivan0124/my-study/blob/master/R_QA_ML_model/images/20161117_ML.png)

