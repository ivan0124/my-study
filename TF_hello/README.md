#How to setup TensorFlow environment ( for Ubuntu 14.04)
1.Tutorial

http://nodered.org/docs/creating-nodes/

# How to use TensorBoard (for Ubuntu 14.04)
1. run `tf_test.py` to generate logs
<pre>
$ ./tf_test.py
</pre>
2. specify logs folder and start `TensorBoard`
<pre>
$ tensorboard --logdir=/mnt/my-study/TF_hello/logs
</pre>
3. use Browser 127.0.0.1:6006 to see logs.

![link images](https://github.com/ivan0124/my-study/blob/master/TF_hello/images/20160822_5.png)
