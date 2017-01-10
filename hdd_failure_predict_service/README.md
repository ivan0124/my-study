#How to deploy HDD failure predict container

- Step1: Install Docker on x86 Ubuntu
https://docs.docker.com/engine/installation/linux/ubuntulinux/

- Step2: run [deploy.sh](https://github.com/ADVANTECH-Corp/hdd_failure_predict_service/blob/master/deploy.sh) to deploy `mqtt-bus` and `hdd_failure_predict` containers
<pre>
$ ./deploy.sh
</pre>


#How to test HDD failure predict container

![result link](https://github.com/ADVANTECH-Corp/hdd_failure_predict_service/blob/master/images/docker_20161202_1.png)

- Step1: import below `node-red client` and run on the host PC.
- Step2: trigger `node-red client` to send simulate data to `mqtt-bus` container.

![result link](https://github.com/ADVANTECH-Corp/hdd_failure_predict_service/blob/master/images/docker_20161202_4.png)

<pre>
[
	{
		"id": "955c11ed.f1db7",
		"type": "inject",
		"z": "25827ce1.3df244",
		"name": "test data 1",
		"topic": "/cagent/admin/123779999/deviceinfo",
		"payload": "{\"susiCommData\":{\"data\":{\"HDDMonitor\":{\"hddInfoList\":[{\"e\":[{\"n\":\"hddType\",\"sv\":\"STDDisk\"},{\"n\":\"hddName\",\"sv\":\"ST9250315AS\"},{\"n\":\"hddIndex\",\"v\":0},{\"n\":\"powerOnTime\",\"v\":14243,\"u\":\"hour\"},{\"n\":\"hddHealthPercent\",\"v\":100,\"u\":\"percent\"},{\"n\":\"hddTemp\",\"v\":31,\"u\":\"celsius\"}],\"bn\":\"Disk0-ST9250315AS\",\"ver\":1,\"asm\":\"R\"}],\"hddSmartInfoList\":[{\"BaseInfo\":{\"e\":[{\"n\":\"hddType\",\"sv\":\"STDDisk\"},{\"n\":\"hddName\",\"sv\":\"ST9250315AS\"},{\"n\":\"hddIndex\",\"v\":0}],\"bn\":\"BaseInfo\",\"asm\":\"R\"},\"FreeFallProtection\":{\"e\":[{\"n\":\"type\",\"v\":5},{\"n\":\"flags\",\"v\":12800},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"00000000FD08\"}],\"bn\":\"FreeFallProtection\",\"asm\":\"R\"},\"UltraDMACRCErrorCount\":{\"e\":[{\"n\":\"type\",\"v\":9},{\"n\":\"flags\",\"v\":15872},{\"n\":\"worst\",\"v\":200},{\"n\":\"value\",\"v\":200},{\"n\":\"vendorData\",\"sv\":\"000000004E71\"}],\"bn\":\"UltraDMACRCErrorCount\",\"asm\":\"R\"},\"UncorrectableSectorCount\":{\"e\":[{\"n\":\"type\",\"v\":198},{\"n\":\"flags\",\"v\":4096},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"000000000038\"}],\"bn\":\"UncorrectableSectorCount\",\"asm\":\"R\"},\"CurrentPendingSectorCount\":{\"e\":[{\"n\":\"type\",\"v\":197},{\"n\":\"flags\",\"v\":4608},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"000000000038\"}],\"bn\":\"CurrentPendingSectorCount\",\"asm\":\"R\"},\"HardwareECCRecovered\":{\"e\":[{\"n\":\"type\",\"v\":187},{\"n\":\"flags\",\"v\":6656},{\"n\":\"worst\",\"v\":45},{\"n\":\"value\",\"v\":47},{\"n\":\"vendorData\",\"sv\":\"000000000349\"}],\"bn\":\"HardwareECCRecovered\",\"asm\":\"R\"},\"Temperature\":{\"e\":[{\"n\":\"type\",\"v\":194},{\"n\":\"flags\",\"v\":8704},{\"n\":\"worst\",\"v\":43},{\"n\":\"value\",\"v\":31},{\"n\":\"vendorData\",\"sv\":\"000000000016\"}],\"bn\":\"Temperature\",\"asm\":\"R\"},\"LoadCycleCount\":{\"e\":[{\"n\":\"type\",\"v\":193},{\"n\":\"flags\",\"v\":12800},{\"n\":\"worst\",\"v\":1},{\"n\":\"value\",\"v\":1},{\"n\":\"vendorData\",\"sv\":\"0000000356EC\"}],\"bn\":\"LoadCycleCount\",\"asm\":\"R\"},\"PoweroffRetractCount\":{\"e\":[{\"n\":\"type\",\"v\":192},{\"n\":\"flags\",\"v\":12800},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"000000000008\"}],\"bn\":\"PoweroffRetractCount\",\"asm\":\"R\"}},{\"BaseInfo\":{\"e\":[{\"n\":\"hddType\",\"sv\":\"STDDisk\"},{\"n\":\"hddName\",\"sv\":\"HDD_Hello_123456\"},{\"n\":\"hddIndex\",\"v\":0}],\"bn\":\"BaseInfo\",\"asm\":\"R\"},\"FreeFallProtection\":{\"e\":[{\"n\":\"type\",\"v\":5},{\"n\":\"flags\",\"v\":12800},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"00000001FD08\"}],\"bn\":\"FreeFallProtection\",\"asm\":\"R\"},\"UltraDMACRCErrorCount\":{\"e\":[{\"n\":\"type\",\"v\":9},{\"n\":\"flags\",\"v\":15872},{\"n\":\"worst\",\"v\":200},{\"n\":\"value\",\"v\":200},{\"n\":\"vendorData\",\"sv\":\"000000014E71\"}],\"bn\":\"UltraDMACRCErrorCount\",\"asm\":\"R\"},\"UncorrectableSectorCount\":{\"e\":[{\"n\":\"type\",\"v\":198},{\"n\":\"flags\",\"v\":4096},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"000000000138\"}],\"bn\":\"UncorrectableSectorCount\",\"asm\":\"R\"},\"CurrentPendingSectorCount\":{\"e\":[{\"n\":\"type\",\"v\":197},{\"n\":\"flags\",\"v\":4608},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"000000000138\"}],\"bn\":\"CurrentPendingSectorCount\",\"asm\":\"R\"},\"HardwareECCRecovered\":{\"e\":[{\"n\":\"type\",\"v\":187},{\"n\":\"flags\",\"v\":6656},{\"n\":\"worst\",\"v\":45},{\"n\":\"value\",\"v\":47},{\"n\":\"vendorData\",\"sv\":\"000000001349\"}],\"bn\":\"HardwareECCRecovered\",\"asm\":\"R\"},\"Temperature\":{\"e\":[{\"n\":\"type\",\"v\":194},{\"n\":\"flags\",\"v\":8704},{\"n\":\"worst\",\"v\":43},{\"n\":\"value\",\"v\":31},{\"n\":\"vendorData\",\"sv\":\"000000000116\"}],\"bn\":\"Temperature\",\"asm\":\"R\"},\"LoadCycleCount\":{\"e\":[{\"n\":\"type\",\"v\":193},{\"n\":\"flags\",\"v\":12800},{\"n\":\"worst\",\"v\":1},{\"n\":\"value\",\"v\":1},{\"n\":\"vendorData\",\"sv\":\"0000001356EC\"}],\"bn\":\"LoadCycleCount\",\"asm\":\"R\"},\"PoweroffRetractCount\":{\"e\":[{\"n\":\"type\",\"v\":192},{\"n\":\"flags\",\"v\":12800},{\"n\":\"worst\",\"v\":100},{\"n\":\"value\",\"v\":100},{\"n\":\"vendorData\",\"sv\":\"000000000018\"}],\"bn\":\"PoweroffRetractCount\",\"asm\":\"R\"}}]}}}}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"x": 159,
		"y": 75,
		"wires": [
			[
				"6be330d6.e5fd6"
			]
		]
	},
	{
		"id": "6be330d6.e5fd6",
		"type": "mqtt out",
		"z": "25827ce1.3df244",
		"name": "ML_predict",
		"topic": "/cagent/admin/123779999/deviceinfo",
		"qos": "0",
		"retain": "",
		"broker": "3f7efa38.0a4936",
		"x": 436,
		"y": 75,
		"wires": []
	},
	{
		"id": "7280f0ba.b5b82",
		"type": "debug",
		"z": "25827ce1.3df244",
		"name": "",
		"active": true,
		"console": "false",
		"complete": "false",
		"x": 424,
		"y": 160,
		"wires": []
	},
	{
		"id": "5145b509.59558c",
		"type": "mqtt in",
		"z": "25827ce1.3df244",
		"name": "ML_predict_result",
		"topic": "/cagent/admin/+/eventnotify",
		"qos": "0",
		"broker": "3f7efa38.0a4936",
		"x": 163,
		"y": 160,
		"wires": [
			[
				"7280f0ba.b5b82"
			]
		]
	},
	{
		"id": "3f7efa38.0a4936",
		"type": "mqtt-broker",
		"z": "25827ce1.3df244",
		"broker": "172.22.212.252",
		"port": "1883",
		"tls": null,
		"clientid": "",
		"usetls": false,
		"compatmode": true,
		"keepalive": "60",
		"cleansession": true,
		"willTopic": "",
		"willQos": "0",
		"willRetain": null,
		"willPayload": "",
		"birthTopic": "",
		"birthQos": "0",
		"birthRetain": null,
		"birthPayload": ""
	}
]
</pre>

