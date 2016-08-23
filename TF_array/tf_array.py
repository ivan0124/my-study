#!/usr/bin/python

import tensorflow as tf
import numpy as np

X = tf.placeholder(tf.float32, [3, 2])
W = tf.Variable(tf.zeros([2, 1]))

#X = tf.constant([[1., 1.],[2.,2.],[3.,3.]])
#W = tf.constant([[3.],[4.]])
y_pred = tf.matmul(X, W)  
# Before starting, initialize the variables.  We will 'run' this first.
init = tf.initialize_all_variables()

# Launch the graph.
sess = tf.Session()
sess.run(init)

print sess.run(y_pred, feed_dict={X: [[1., 1.], [2., 2.], [3.,3.]],W:[[3.],[4.]]})
