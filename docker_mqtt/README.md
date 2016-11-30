# How to build docker image
1. in `docker_mqtt` folder 
<pre>
$ sudo docker build -t eis/mqtt .
</pre>

# How to run docker image
1. start container. name is `mqtt`
<pre>
$ sudo docker run -it --name mqtt eis/mqtt
or 
$ sudo docker run -it --name mqtt -v $PWD:/home/adv:rw eis/mqtt

</pre>

2. restart container. name is `mqtt`
<pre>
$ sudo docker start -ai mqtt
</pre>

3. stop container. name is `mqtt`
<pre>
$ sudo docker rm  mqtt
</pre>
