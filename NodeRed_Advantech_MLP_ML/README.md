#How to setup TensorFlow environment ( for Ubuntu 14.04 64bit/single CPU)
Tutorial

https://www.tensorflow.org/versions/r0.10/get_started/os_setup.html

2. install pip
<pre>
# Ubuntu/Linux 64-bit
$ sudo apt-get install python-pip python-dev
</pre>

3. export path
<pre>
# Ubuntu/Linux 64-bit, CPU only, Python 2.7
$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.10.0rc0-cp27-none-linux_x86_64.whl
</pre>

4. install TensorFlow
<pre>
# Python 2
$ sudo pip install --upgrade $TF_BINARY_URL
</pre>

5. install other dependencies
<pre>
# For Python 2.7:
$ sudo apt-get install python-numpy swig python-dev python-wheel
</pre>


# How to use TensorBoard (for Ubuntu 14.04)
1. run `tf_adaline.py` to generate logs
<pre>
$ ./tf_adaline.py
</pre>
2. specify logs folder and start `TensorBoard`
<pre>
$ tensorboard --logdir=/mnt/my-study/TF_hello/logs
</pre>
3. use Browser 127.0.0.1:6006 to see logs.

![link images](https://github.com/ivan0124/my-study/blob/master/TF_hello/images/20160822_5.png)
