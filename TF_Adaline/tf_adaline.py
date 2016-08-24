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
optimizer = tf.train.GradientDescentOptimizer(0.001)
train = optimizer.minimize(loss)

# Before starting, initialize the variables.  We will 'run' this first.
init = tf.initialize_all_variables()

# Launch the graph.
sess = tf.Session()
sess.run(init)

#add logs
tf.scalar_summary('loss function', loss)
merged_summary_op = tf.merge_all_summaries()
summary_writer = tf.train.SummaryWriter('./logs', sess.graph)


for i in range(100):
  x_data=[[1.,1.], [2.,2.], [3.,3.]]
  y_answer=[[1.],[-1.],[1.]]
  sess.run(train, feed_dict={X: x_data, y_: y_answer})
  summary_str = sess.run(merged_summary_op, feed_dict={X: x_data, y_: y_answer}) 
  summary_writer.add_summary(summary_str, i)
  
