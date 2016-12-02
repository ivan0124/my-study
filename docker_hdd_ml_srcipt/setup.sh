#!/bin/bash
MQTT_IMAGE=advigw4x86/mqtt-bus
MQTT_CONTAINER=mqtt
HDD_FAILURE_PREDICT_IMAGE=advigw4x86/hdd-failure-predict:v0.0.1
HDD_FAILURE_PREDICT_CONTAINER=hdd-failure-predict
ADVANTECH_NET=advantech-net


#stop container
echo "======================================="
echo "[Stpe1]: Stop container......"
echo "======================================="
sudo docker stop $MQTT_CONTAINER
sudo docker stop $HDD_FAILURE_PREDICT_CONTAINER

#remove container
echo "======================================="
echo "[Step2]: Remove container......"
echo "======================================="
sudo docker rm $MQTT_CONTAINER
sudo docker rm $HDD_FAILURE_PREDICT_CONTAINER

#pull images
echo "======================================="
echo "[Step3]: Pull container images......"
echo "======================================="
sudo docker pull $MQTT_IMAGE
sudo docker pull $HDD_FAILURE_PREDICT_IMAGE

#create user-defined network `advantech-net`
NET=`sudo docker network ls | grep $ADVANTECH_NET | awk '{ print $2}'`
if [ "$NET" != "$ADVANTECH_NET" ] ; then
echo "======================================="
echo "$ADVANTECH_NET does not exist, create $ADVANTECH_NET network..."
echo "======================================="
sudo docker network create -d bridge $ADVANTECH_NET
fi

#run container and join to `advantech-net` network
echo "======================================="
echo "[Step4]: Run container images......"
echo "======================================="
sudo docker run --network=$ADVANTECH_NET -itd --name $MQTT_CONTAINER $MQTT_IMAGE
sudo docker run --network=$ADVANTECH_NET -it --name $HDD_FAILURE_PREDICT_CONTAINER $HDD_FAILURE_PREDICT_IMAGE
