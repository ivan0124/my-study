#!/bin/bash
MQTT_IMAGE=advigw4x86/mqtt-bus
MQTT_CONTAINER=advigw-mqtt-bus
HDD_FAILURE_PREDICT_IMAGE=advigw4x86/hdd-failure-predict
HDD_FAILURE_PREDICT_CONTAINER=hdd-failure-predict
ADVANTECH_NET=advigw_network


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
echo "[Step4]: $ADVANTECH_NET does not exist, create $ADVANTECH_NET network..."
echo "======================================="
sudo docker network create -d bridge --subnet 172.25.0.0/16 $ADVANTECH_NET
else
echo "======================================="
echo "[Step4]: Found $ADVANTECH_NET network. $ADVANTECH_NET exist."
echo "======================================="
fi

#run container and join to `advantech-net` network
echo "======================================="
echo "[Step5]: Run container images......"
echo "======================================="
sudo docker run -d -it --name $MQTT_CONTAINER -p 1883:1883 $MQTT_IMAGE
#For release
sudo docker run -d -it --name $HDD_FAILURE_PREDICT_CONTAINER $HDD_FAILURE_PREDICT_IMAGE
#For develop
#sudo docker run -d -it --name $HDD_FAILURE_PREDICT_CONTAINER -v $PWD:/home/adv:rw $HDD_FAILURE_PREDICT_IMAGE

#join to user-defined network advigw_network
echo "======================================="
echo "[Step6]: Join to network advigw_network......"
echo "======================================="
sudo docker network connect $ADVANTECH_NET $MQTT_CONTAINER
sudo docker network connect $ADVANTECH_NET $HDD_FAILURE_PREDICT_CONTAINER

#sudo docker exec -it $HDD_FAILURE_PREDICT_CONTAINER /bin/bash
