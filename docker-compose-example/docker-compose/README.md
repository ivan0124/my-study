docker-igw-image
This Docker image can support API-Gateway, Node-Red ,MQTT, WSN-Simulator, and WSN-Development sevices for x86_64 Linux OS Platform.

#Requirement
Arch: x86_64
OS: Ubuntu 14.04 x86_64
Docker Engine: 1.11.2
Docker Compose: 1.9.0

# Deploy
You can run deploy.sh to deploy the EIS software service to your  IoT Gateway with Docker Engine.

```go
Deploy EIS SW Service: Pull and run all EIS Docker container service
#./deploy.sh

Pull all EIS images
#./deploy.sh pull

Stop and remove all EIS containers
#./deploy.sh down

Remove all EIS Docker images
#./deploy.sh rmi

Restart all EIS Docker Container
#./deploy.sh restart



```

# Dockerfile

You can change branch to checkout each image's Dockerfile

Branch:

## node-red
This Docker image can support Node-Red sevice

## mqtt-bus
This Docker image can support MQTT Bus sevice

## api-gw
This Docker image can support API Gateway service

## wsn-simulator
This Docker image is a WSN Simulator

## wisesnail-lib-dev
Thsi Docker image is a developing environment includes wisesnail library and sample code.
