# How to build docker image
1. in `docker_apiGateway` folder 
<pre>
$ sudo docker build -t eis/api_gateway .
</pre>

# How to run docker image
1. start container. name is `api_gateway`
<pre>
$ sudo docker run -it --name api_gateway -p 3000:3000 eis/api_gateway
or 
$ sudo docker run -it --name api_gateway -v $PWD:/home/adv:rw -p 3000:3000 eis/api_gateway

</pre>

2. restart container. name is `api_gateway`
<pre>
$ sudo docker start -ai api_gateway
</pre>

3. stop container. name is `api_gateway`
<pre>
$ sudo docker rm  api_gateway
</pre>
