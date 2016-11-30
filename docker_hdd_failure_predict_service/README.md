# How to build docker image
1. in `docker_hdd_failure_predict_service` folder 
<pre>
$ sudo docker build -t eis/hdd_failure_predict_service .
</pre>

# How to run docker image
1. start container. name is `hdd_failure_predict_service`
<pre>
$ sudo docker run -it --name hdd_failure_predict_service eis/hdd_failure_predict_service
or 
$ sudo docker run -it --name hdd_failure_predict_service -v $PWD:/home/adv:rw eis/hdd_failure_predict_service

</pre>

2. restart container. name is `hdd_failure_predict_service`
<pre>
$ sudo docker start -ai hdd_failure_predict_service
</pre>

3. stop container. name is `hdd_failure_predict_service`
<pre>
$ sudo docker rm  hdd_failure_predict_service
</pre>
