#Tutorial
http://nodered.org/docs/creating-nodes/

https://nodered.org/docs/creating-nodes/config-nodes

# How to test (for Ubuntu 14.04)
1. git clone https://github.com/ivan0124/docker_alpine_node_red.git
2. launch `deploy.sh`
1. copy files `hdd-pmq.js`, `hdd-pmq.html` to `/usr/lib/node_modules/node-red/nodes/core/io/` in container
2. run `/usr/bin/node-red` in container
3. you will see node in browser

![image link](https://github.com/ivan0124/my-study/blob/master/create_NodeRed_node/image/20160817_node_red.png)
