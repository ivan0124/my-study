# TensorFlow Docker File
Tutorial: https://github.com/tensorflow/tensorflow/blob/master/tensorflow/tools/docker/Dockerfile

# How to build docker image
1. in `docker_TensorFlow` folder 
<pre>
$ sudo docker build -t eis/hdd_ml_dev .
</pre>

# How to run docker image
1. start container
<pre>
$ sudo docker run -it --name hdd_ml_dev -v $PWD:/home/adv:rw -p 3000:3000 eis/hdd_ml_dev
</pre>

2. restart container
<pre>
$ sudo docker start -ai hdd_ml_dev
</pre>
