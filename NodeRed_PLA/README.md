#Tutorial
http://nodered.org/docs/creating-nodes/

# How to test (for Ubuntu 14.04)
1. copy node `my-pla.html, my-pla.html, pla.py` to `~/.node-red/nodes`
2. run `node-red`
3. you will see node in browser

![image link](https://github.com/ivan0124/my-study/blob/master/NodeRed_PLA/image/NodeRed_PLA_20160822.png)

4. import NodeRed test code
**Source code**
```json
[
	{
		"id": "9331ad12.c4ad58",
		"type": "debug",
		"z": "aff07acb.e746a8",
		"name": "Display status",
		"active": true,
		"console": "false",
		"complete": "payload",
		"x": 568,
		"y": 76,
		"wires": []
	},
	{
		"id": "baba4683.ab67d8",
		"type": "debug",
		"z": "aff07acb.e746a8",
		"name": "",
		"active": true,
		"console": "false",
		"complete": "false",
		"x": 587,
		"y": 252,
		"wires": []
	},
	{
		"id": "1aae4802.7f7e8",
		"type": "file in",
		"z": "aff07acb.e746a8",
		"name": "",
		"filename": "/home/ivan/.node-red/nodes/FILE.INI",
		"format": "utf8",
		"x": 344,
		"y": 356,
		"wires": [
			[
				"baba4683.ab67d8",
				"46d61da4.c7a314"
			]
		]
	},
	{
		"id": "ac2b6630.d844d",
		"type": "inject",
		"z": "aff07acb.e746a8",
		"name": "set ML param",
		"topic": "",
		"payload": "",
		"payloadType": "date",
		"repeat": "",
		"crontab": "",
		"once": false,
		"x": 105,
		"y": 356,
		"wires": [
			[
				"1aae4802.7f7e8"
			]
		]
	},
	{
		"id": "46d61da4.c7a314",
		"type": "my-PLA",
		"z": "aff07acb.e746a8",
		"name": "",
		"x": 357,
		"y": 159,
		"wires": [
			[
				"9331ad12.c4ad58"
			]
		]
	},
	{
		"id": "b10ef2f5.4f9d9",
		"type": "function",
		"z": "aff07acb.e746a8",
		"name": "simulate device data",
		"func": "\nif (msg.payload == \"input_data\"){\n   // context.global.input_T=0;\n   // context.global.input_H=0;\n    \n    if (typeof context.global.input_T == 'undefined'){\n        context.global.input_T = 0;\n    }\n    \n    if (typeof context.global.input_H == 'undefined'){\n        context.global.input_H = 0;\n    }\n    \n    //input_T\n    if (context.global.input_T > 100){\n        context.global.input_T = 0\n    }\n    else{\n        context.global.input_T += 5;\n    }\n    //input_H    \n    if (context.global.input_H > 100){\n        context.global.input_H = 0\n    }\n    else{\n        context.global.input_H += 10;\n    }\n    \n    msg.payload=context.global.input_T + \",\" + context.global.input_H\n}\nreturn msg;",
		"outputs": 1,
		"noerr": 0,
		"x": 146,
		"y": 160,
		"wires": [
			[
				"46d61da4.c7a314"
			]
		]
	},
	{
		"id": "ae456837.9a409",
		"type": "inject",
		"z": "aff07acb.e746a8",
		"name": "timer to trigger",
		"topic": "",
		"payload": "input_data",
		"payloadType": "str",
		"repeat": "",
		"crontab": "",
		"once": false,
		"x": 132,
		"y": 69,
		"wires": [
			[
				"b10ef2f5.4f9d9"
			]
		]
	}
]
```

![image link](https://github.com/ivan0124/my-study/blob/master/NodeRed_PLA/image/NodeRed_PLA_20160822_1.png)
