FROM ubuntu:14.04

#MAINTAINER Advantech

#update and install npm
RUN apt-get update
RUN apt-get install -y npm

#tools
RUN apt-get install -y vim
RUN apt-get install -y sudo git

# Install nodejs and npm node-red
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs

# Install R environment
RUN apt-get -y install r-base

# adv account
RUN useradd -m -k /home/adv adv -p adv -s /bin/bash -G sudo

# set up adv as sudo
RUN echo "adv ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
WORKDIR /home/adv

# install APIGateway
#RUN git clone https://github.com/ADVANTECH-Corp/APIGateway.git /home/adv/APIGateway
#RUN cp APIGateway/script/advigw-restapi /usr/local/bin/.

USER adv

# Run api-gw
#ENTRYPOINT ["advigw-restapi"]
