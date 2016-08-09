#/bin/bash
#
cp -rf ./src/ /mnt/WISE_IOT/NetDevice/Mqtt/
cd /mnt/WISE_IOT/NetDevice/Mqtt/
make clean
make
sudo cp -f /mnt/WISE_IOT/NetDevice/Mqtt/src/.libs/libMqttDrv.so.1.0.0 /usr/lib/Advantech/iotgw/
sudo cp -f /mnt/WISE_IOT/NetDevice/Mqtt/src/.libs/libMqttDrv.a /usr/lib/Advantech/iotgw/
sudo cp -f /mnt/WISE_IOT/NetDevice/Mqtt/src/.libs/libMqttDrv.la /usr/lib/Advantech/iotgw/
