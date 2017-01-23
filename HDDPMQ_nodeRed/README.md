# node-red-contrib-hddpmq
A collection of [Node-RED](http://nodered.org) nodes to Access ADVANTECH  Wireless Sensor Network (WSN) APIs.


## Nodes included in the package
**wsn-gw** Get/Set information for WSN gateways.

**wsn-senhub** Get/Set information for remote SensorHubs, e.g. WISE-1020, controlled by WSN gateway.

## Usage example
**[wsn-gw]**

![Flow_wsn-gw](./image/hddpmq_20170123_2.png)

![Edit_wsn-gw](./image/hddpmq_20170123_1.png)

- **Operation :** Get or Set
- **Net Type :** Supported network types on the platform
- **Net ID :** List of available network interfaces of selected *Net Type* above. Options are listed in the format of : ***Interface Name ( Interface MAC )***. Ex: WSN0(00170d0000010203)
- **Category :** Class of Attributes
- **Attribute :** List of Attributes in selected *Category* above
- **Set to :** Place for entering value when Operation is *Set*
- **Name :** *(Optional)* Place for entering the name of this node

## Tested Platform 

 
## History
- 0.2.1 - Feb 2017 : Initial Release

## License
Copyright 2017 ADVANTECH Corp. under [the Apache 2.0 license](LICENSE)
