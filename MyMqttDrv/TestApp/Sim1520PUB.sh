#!/bin/sh
VERSION="1.1.0.0"

GW_IP="172.22.12.114"
#GW_IP="dev-wisepaas.cloudapp.net"
OUR_IP="172.22.12.175"
GW_ID="0000E4B85E4ADB01"
GW_SHL="0007E4B85E4ADB01,0017E4B85E4ADB01"
GW_BN="0007E4B85E4ADB01"
GW_NB="0017E4B85E4ADB01"
HOSTNAME="WISE-1520(DB01)"
DEV_MACADDRESS="0017E4B85E4ADB01"
MACADDRESS="E4B85E4ADB01"
MACADDRESS_STR="E4:B8:5E:4A:DB:01"
WILLTOPIC="/cagent/admin/$MACADDRESS/willmessage"
timestamp=160081020

WILLMESSAGE_JSON="{\"susiCommData\":{\"devID\":\"$GW_ID\",\"hostname\":\"$HOSTNAME\",\"sn\":\"$MACADDRESS\",\"mac\":\"$MACADDRESS\",\"version\":\"$VERSION\",\"type\":\"IoTGW\",\"product\":\"\",\"manufacture\":\"\",\"account\":\"anonymous\",\"passwd\":\"\",\"status\":0,\"commCmd\":1,\"requestID\":21,\"agentID\":\"$GW_ID\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

WA_PUB_CONNECT_TOPIC="/cagent/admin/$GW_ID/agentinfoack"
WA_PUB_ACTION_TOPIC="/cagent/admin/$GW_ID/agentactionreq"
WA_PUB_DEVINFO_TOPIC="/cagent/admin/$GW_ID/deviceinfo"
WA_PUB_SEN_ACTION_TOPIC="/cagent/admin/$DEV_MACADDRESS/agentactionreq"
WA_SUB_CBK_TOPIC="/cagent/admin/$GW_ID/agentcallbackreq"

CONNECT_JSON="{\"susiCommData\":{\"devID\":\"$GW_ID\",\"hostname\":\"$HOSTNAME\",\"sn\":\"$MACADDRESS\",\"mac\":\"$MACADDRESS\",\"version\":\"$VERSION\",\"type\":\"IoTGW\",\"product\":\"\",\"manufacture\":\"\",\"account\":\"anonymous\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\"requestID\":21,\"agentID\":\"$GW_ID\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

OSINFO_JSON="{\"susiCommData\":{\"osInfo\":{\"cagentVersion\":\"$VERSION\",\"cagentType\":\"IoTGW\",\"osVersion\":\"\",\"biosVersion\":\"\",\"platformName\":\"\",\"processorName\":\"\",\"osArch\":\"RTOS\",\"totalPhysMemKB\":1026060,\"macs\":\"$MACADDRESS_STR\",\"IP\":\"$OUR_IP\"},\"commCmd\":116,\"requestID\":109,\"agentID\":\"$GW_ID\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

INFOSPEC_JSON="{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"WSN\":{\"WSN0\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"$GW_SHL\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"$GW_NB\",\"asm\":\"r\"},{\"n\":\"Health\",\"v\":100,\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"WSN0\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},{\"n\":\"reset\",\"bv\":0,\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"$GW_BN\",\"ver\":1},\"bn\":\"WSN\",\"ver\":1},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"$GW_ID\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

DEVICEINFO_JSON="{\"susiCommData\":{\"data\":{\"IoTGW\":{\"WSN\":{\"WSN0\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"$GW_SHL\"},{\"n\":\"Neighbor\",\"sv\":\"$GW_NB\"},{\"n\":\"Health\",\"v\":100},{\"n\":\"Name\",\"sv\":\"WSN0\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\"},{\"n\":\"reset\",\"bv\":0}],\"bn\":\"Info\"},\"bn\":\"$GW_BN\",\"ver\":1},\"bn\":\"WSN\"},\"ver\":1}},\"commCmd\":2055,\"requestID\":2001,\"agentID\":\"$GW_ID\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

SEN_CONNECT_JSON="{\"susiCommData\":{\"devID\":\"$GW_NB\",\"hostname\":\"OnBoard\",\"sn\":\"$GW_NB\",\"mac\":\"$GW_NB\",\"version\":\"$VERSION\",\"type\":\"SenHub\",\"product\":\"WISE-1020\",\"manufacture\":\"\",\"status\":\"1\",\"commCmd\":1,\"requestID\":30002,\"agentID\":\"$GW_NB\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

SEN_INFOSPEC_SENDATA_V_JSON="{\"n\":\"Temperature\",\"u\":\"Cel\",\"v\":26,\"min\":0,\"max\":100,\"asm\":\"r\",\"type\":\"d\",\"rt\":\"ucum.Cel\",\"st\":\"ipso\",\"exten\":\"\"}"
SEN_INFOSPEC_SENDATA_SV_JSON="{\"n\":\"Humidity\",\"u\":\"%\",\"sv\":\"10,20,30\",\"min\":0,\"max\":100,\"asm\":\"r\",\"type\":\"e\",\"rt\":\"ucum.%\",\"st\":\"ipso\",\"exten\":\"\"}"
SEN_INFOSPEC_SENDATA_BV_JSON="{\"n\":\"%s\",\"u\":\"%s\",\"bv\":%d,\"min\":%d,\"max\":%d,\"asm\":\"r\",\"type\":\"b\",\"rt\":\"%s\",\"st\":\"ipso\",\"exten\":\"\"}"


SEN_INFOSPEC_JSON="{\"susiCommData\":{\"infoSpec\":{\"SenHub\":{\"Info\":{\"e\":[{\"n\":\"Name\",\"sv\":\"OnBoard\",\"asm\":\"rw\"},{\"n\":\"sw\",\"sv\":\"1.0.00\",\"asm\":\"r\"},{\"n\":\"reset\",\"bv\":1,\"asm\":\"rw\"}],\"bn\":\"Info\"},\"SenData\":{\"e\":[$SEN_INFOSPEC_SENDATA_V_JSON,$SEN_INFOSPEC_SENDATA_SV_JSON],\"bn\":\"SenData\"},\"Net\":{\"e\":[{\"n\":\"Health\",\"v\":100,\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"$GW_BN\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.0.00\",\"asm\":\"r\"}],\"bn\":\"Net\"},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"$GW_NB\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

SEN_DEVINFO_JSON="{\"susiCommData\":{\"data\":{\"SenHub\":{\"SenData\":{\"e\":[$SEN_INFOSPEC_SENDATA_V_JSON,$SEN_INFOSPEC_SENDATA_SV_JSON],\"bn\":\"SenData\"},\"Net\":{\"e\":[{\"n\":\"Health\",\"v\":100},{\"n\":\"Neighbor\",\"sv\":\"$GW_BN\"}],\"bn\":\"Net\"},\"ver\":1}},\"commCmd\":2055,\"requestID\":2001,\"agentID\":\"$GW_NB\",\"handlerName\":\"general\",\"sendTS\":$timestamp}}"

SEN_DEVINFO_SENDATA_V_JSON="{\"n\":\"%s\",\"v\":%d}"
SEN_DEVINFO_SENDATA_SV_JSON="{\"n\":\"%s\",\"sv\":%s}"
SEN_DEVINFO_SENDATA_BV_JSON="{\"n\":\"%s\",\"bv\":%d}"

echo "DevMac: $DEV_MACADDRESS"

ctrl_c() {
    echo "Trapped CTRL-C and exit!"
	mosquitto_pub -h $GW_IP --will-topic $WILLTOPIC --will-payload $WILLMESSAGE_JSON -t $WILLTOPIC -m $WILLMESSAGE_JSON
	exit $?
}

trap ctrl_c INT

mosquitto_pub -h $GW_IP -t $WA_PUB_CONNECT_TOPIC -m $CONNECT_JSON
sleep 1
mosquitto_pub -h $GW_IP -t $WA_PUB_ACTION_TOPIC -m $OSINFO_JSON
sleep 1
mosquitto_pub -h $GW_IP -t $WA_PUB_ACTION_TOPIC -m $INFOSPEC_JSON
sleep 1
mosquitto_pub -h $GW_IP -t $WA_PUB_DEVINFO_TOPIC -m $DEVICEINFO_JSON
sleep 1
mosquitto_pub -h $GW_IP -t $WA_PUB_CONNECT_TOPIC -m $SEN_CONNECT_JSON
sleep 1
mosquitto_pub -h $GW_IP -t $WA_PUB_SEN_ACTION_TOPIC -m $SEN_INFOSPEC_JSON
echo "End...."

while true; do
SEN_DEVINFO_JSON="{\"susiCommData\":{\"data\":{\"SenHub\":{\"SenData\":{\"e\":[$SEN_INFOSPEC_SENDATA_V_JSON,$SEN_INFOSPEC_SENDATA_SV_JSON],\"bn\":\"SenData\"},\"Net\":{\"e\":[{\"n\":\"Health\",\"v\":100},{\"n\":\"Neighbor\",\"sv\":\"$GW_BN\"}],\"bn\":\"Net\"},\"ver\":1}},\"commCmd\":2055,\"requestID\":2001,\"agentID\":\"$GW_NB\",\"handlerName\":\"general\",\"sendTS\":`date +%d%H%m%S`}}"

mosquitto_pub -h $GW_IP -t $WA_PUB_DEVINFO_TOPIC -m $SEN_DEVINFO_JSON
sleep 5
done
