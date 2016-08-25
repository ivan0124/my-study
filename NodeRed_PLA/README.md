#Tutorial
http://nodered.org/docs/creating-nodes/

# How to test (for Ubuntu 14.04)
1. copy node `my-pla.html, my-pla.js, pla.py, FILE.INI` to `~/.node-red/nodes`
2. specify `pla.py` path in `my-pla.js`
![image link](https://github.com/ivan0124/my-study/blob/master/NodeRed_PLA/image/20160825_1.png)

3. run `node-red`
4. you will see node in browser

![image link](https://github.com/ivan0124/my-study/blob/master/NodeRed_PLA/image/NodeRed_PLA_20160822.png)

4. import NodeRed test code

![image link](https://github.com/ivan0124/my-study/blob/master/NodeRed_PLA/image/NodeRed_PLA_20160822_1.png)

**Node-Red Source code**
```json
[
	{
		"id": "7c02f296.10d7bc",
		"type": "debug",
		"z": "12a0fcbd.7a1fab",
		"name": "",
		"active": true,
		"console": "false",
		"complete": "false",
		"x": 601.75,
		"y": 268.75,
		"wires": []
	},
	{
		"id": "2f99eaee.6e0396",
		"type": "file in",
		"z": "12a0fcbd.7a1fab",
		"name": "",
		"filename": "/home/ivan/.node-red/nodes/FILE.INI",
		"format": "utf8",
		"x": 358.75,
		"y": 372.75,
		"wires": [
			[
				"7c02f296.10d7bc",
				"5563ecf3.99b86c"
			]
		]
	},
	{
		"id": "5563ecf3.99b86c",
		"type": "my-PLA",
		"z": "12a0fcbd.7a1fab",
		"name": "",
		"x": 371.75,
		"y": 175.75,
		"wires": [
			[
				"c3cfd28e.8b3ae8"
			]
		]
	},
	{
		"id": "c3cfd28e.8b3ae8",
		"type": "debug",
		"z": "12a0fcbd.7a1fab",
		"name": "Display status",
		"active": true,
		"console": "false",
		"complete": "payload",
		"x": 582.75,
		"y": 92.75,
		"wires": []
	},
	{
		"id": "87bbfd3b.1edae8",
		"type": "function",
		"z": "12a0fcbd.7a1fab",
		"name": "simulate device data",
		"func": "\nif (msg.payload == \"input_data\"){\n   // context.global.input_T=0;\n   // context.global.input_H=0;\n    \n    if (typeof context.global.input_T == 'undefined'){\n        context.global.input_T = 0;\n    }\n    \n    if (typeof context.global.input_H == 'undefined'){\n        context.global.input_H = 0;\n    }\n    \n    //input_T\n    if (context.global.input_T > 100){\n        context.global.input_T = 0\n    }\n    else{\n        context.global.input_T += 5;\n    }\n    //input_H    \n    if (context.global.input_H > 100){\n        context.global.input_H = 0\n    }\n    else{\n        context.global.input_H += 10;\n    }\n    \n    msg.payload=context.global.input_T + \",\" + context.global.input_H\n}\nreturn msg;",
		"outputs": 1,
		"noerr": 0,
		"x": 160.75,
		"y": 176.75,
		"wires": [
			[
				"5563ecf3.99b86c"
			]
		]
	},
	{
		"id": "42d5b823.38b878",
		"type": "inject",
		"z": "12a0fcbd.7a1fab",
		"name": "timer to trigger",
		"topic": "",
		"payload": "input_data",
		"payloadType": "str",
		"repeat": "",
		"crontab": "",
		"once": false,
		"x": 146.75,
		"y": 85.75,
		"wires": [
			[
				"87bbfd3b.1edae8"
			]
		]
	},
	{
		"id": "ef8ed13d.bbbdc",
		"type": "inject",
		"z": "12a0fcbd.7a1fab",
		"name": "set ML param",
		"topic": "",
		"payload": "",
		"payloadType": "date",
		"repeat": "",
		"crontab": "",
		"once": false,
		"x": 119.75,
		"y": 372.75,
		"wires": [
			[
				"2f99eaee.6e0396"
			]
		]
	}
]
```


