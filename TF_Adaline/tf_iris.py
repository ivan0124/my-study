#!/usr/bin/python

import csv
import tensorflow as tf
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

ipd = pd.read_csv("./iris.csv")
ipd.head()

species = list(ipd['Species'].unique())
ipd['One-hot'] = ipd['Species'].map(lambda x: np.eye(len(species))[species.index(x)] )
#print ("ipd.sample(5)=\n%s" % (ipd.sample(5)))

#split the data into training and test sets
shuffled = ipd.sample(frac=1)
trainingSet = shuffled[0:len(shuffled)-50]
testSet = shuffled[len(shuffled)-50:]
#train = trainingSet.sample(50)
#print ("train=\n%s" % (train))

#build Graph
inp = tf.placeholder(tf.float32, [None, 4])
weights = tf.Variable(tf.zeros([4, 3]))
bias = tf.Variable(tf.zeros([3]))

y = tf.nn.softmax(tf.matmul(inp, weights) + bias)

y_ = tf.placeholder(tf.float32, [None, 3])
cross_entropy = -tf.reduce_sum(y_*tf.log(y))

train_step = tf.train.AdamOptimizer(0.01).minimize(cross_entropy)
correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))

init = tf.initialize_all_variables()

sess = tf.Session()
sess.run(init)

#
keys = ['sepal_length', 'sepal_width','petal_length', 'petal_width']
for i in range(1000):
    train = trainingSet.sample(50)
    sess.run(train_step, feed_dict={inp: [x for x in train[keys].values],
                                    y_: [x for x in train['One-hot'].as_matrix()]})

print ("=accuracy=\n%s" % sess.run(accuracy, feed_dict={inp: [x for x in testSet[keys].values], 
                                    y_: [x for x in testSet['One-hot'].values]}))

print ("=weight=\n%s" % sess.run(weights))
print ("=bias=\n%s" % sess.run(bias))

#train = trainingSet.sample(50)
#print ("train['One-hot'].as_matrix()=\n%s" % ([x for x in train['One-hot'].as_matrix()]))
'''
yy=[[1,0,0],
    [1,0,0],
    [1,0,0],
    [0,0,1]]

yy_=[[1,0,0],
     [0,1,0],
     [1,0,0],
     [0,0,1]]
print ("tf.argmax(yy,1)=%s" % sess.run(tf.argmax(yy,1)))
print ("tf.argmax(yy_,1)=%s" % sess.run(tf.argmax(yy_,1)))

c = tf.equal(tf.argmax(yy,1), tf.argmax(yy_,1))
print ("c=%s" % sess.run(c))
print ("c float=%s" % sess.run(tf.cast(c,"float")))
'''

'''
species = list(ipd['Species'].unique())
print ("ipd['Species'].unique()=\n%s" % (ipd['Species'].unique()))
print ("species=\n%s" % (species))
print ("np.eye(len(species))[0]=%s" % np.eye(len(species))[0])
print ("np.eye(len(species))[1]=%s" % np.eye(len(species))[1])
print ("np.eye(len(species))[2]=%s" % np.eye(len(species))[2])
print ("species.index('setosa')=%s" % species.index('setosa'))
print ("species.index('versicolor')=%s" % species.index('versicolor'))
print ("species.index('virginica')=%s" % species.index('virginica'))
ipd['One-hot'] = ipd['Species'].map(lambda x: np.eye(len(species))[species.index(x)] )
print ("ipd.sample(5)=\n%s" % (ipd.sample(5)))

#x-> x*x, input=[1,2,3] --> output=[1,4,9]
print map( lambda x : x*x, [1, 2, 3] )
'''
