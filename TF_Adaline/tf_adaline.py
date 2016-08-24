#!/usr/bin/python

import tensorflow as tf
import numpy as np

X = tf.placeholder(tf.float32, [3, 2])
W = tf.Variable(tf.zeros([2, 1]))
#b = tf.Variable(tf.zeros([3,1]))

#X = tf.constant([[1., 1.],[2.,2.],[3.,3.]])
#W = tf.constant([[3.],[4.]])
y_pred = tf.matmul(X, W) 

#correct answer
y_ =  tf.placeholder(tf.float32, [3, 1])

#
loss = tf.reduce_sum(tf.square(y_ - y_pred))
optimizer = tf.train.GradientDescentOptimizer(0.0001)
train = optimizer.minimize(loss)

a=tf.reduce_sum([[1.,2.],[3.,4.], [5.,6.]],1)
print("a=%s" % (a))

# Before starting, initialize the variables.  We will 'run' this first.
init = tf.initialize_all_variables()

# Launch the graph.
sess = tf.Session()
sess.run(init)

print sess.run(y_pred, feed_dict={X: [[1., 1.], [2., 2.], [3.,3.]],W:[[3.],[4.]]})

for i in range(100):
  sess.run(train, feed_dict={X: [[1.,1.], [2.,2.], [3.,3.]], y_: [[1],[-1],[1]]})
  
print sess.run(a)

print sess.run(W)
