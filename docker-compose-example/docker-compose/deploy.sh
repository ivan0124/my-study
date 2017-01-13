#!/bin/bash

#version control
./version.sh

adv_composefiles=(./advantech/eis-base-service.yml ./advantech/wsn-dev.yml)
exten_composefiles=()

actions=(start stop restart pause unpause rmi rm down pull)


# combine all yml files
for yml in ${adv_composefiles[@]}; do
 compose_param+=" -f ${yml} "
done

for yml in ${exten_composefiles[@]}; do
  compose_param+=" -f ${yml} "
done

# check action
for ac in ${actions[@]}; do
   if [ "$1" == $ac ]; then
   action=$1
   fi
done

# rmi: must to down
if [ "$1" == "rmi" ]; then
 action="down"
fi

# default action: up
if [ "$1" == "" ]; then
 action="up -d"
fi

# warming message
if [ "$1" != "" ] && [ "$action" == "" ]; then 
echo "You enter acton ${1} is not support"
echo "deploy.sh supports '${actions[@]}'"
exit 0
fi

# docker-compose
exec_cmd="sudo docker-compose" 
exec_cmd+=${compose_param} 
exec_cmd+=${action}

echo "Execute: ${exec_cmd}"

if [ "${action}" != "" ]; then
 ${exec_cmd}
fi

if [ "$1" == "rmi" ]; then

images=`sudo docker images | grep "advigw4x86" | awk '{print $3}'`

for image in ${images[@]}; do
 #echo "images ${image}"
 sudo docker rmi ${image}
done
exit 0
fi




