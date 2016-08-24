#!/usr/bin/python

import tensorflow as tf
import numpy as np
import pandas as pd

df = pd.read_csv('./sensor.data',header=None)
df.tail();

#y = df.iloc[0:99, 2].values
#y = np.where(y == 'Abnormal', -1, 1)
#x_data = df.iloc[0:99, [0,1]].values

#print ("x_data=%s" % (x_data))

X = tf.placeholder(tf.float32, [None, 2])
W = tf.Variable(tf.zeros([2, 1]))
b = tf.Variable(tf.zeros([1]))

#X = tf.constant([[1., 1.],[2.,2.],[3.,3.]])
#W = tf.constant([[3.],[4.]])
y_pred = tf.matmul(X, W)+b

#correct answer
y_ =  tf.placeholder(tf.float32, [None, 1])

#
loss = tf.reduce_sum(tf.square(y_ - y_pred))
optimizer = tf.train.GradientDescentOptimizer(0.0001)
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


for i in range(1000):
  x_data=[[1.,1.], [2.,2.], [3.,3.]]
  y_answer=[[1.],[-1.],[1.]]
  #x_data = df.iloc[0:99, [0,1]].values
  #y_answer = df.iloc[0:99, [2]].values
  #print ("y_answer=%s" % y_answer)
  sess.run(train, feed_dict={X: x_data, y_: y_answer})
  summary_str = sess.run(merged_summary_op, feed_dict={X: x_data, y_: y_answer}) 
  summary_writer.add_summary(summary_str, i)
 

print sess.run(W) 
