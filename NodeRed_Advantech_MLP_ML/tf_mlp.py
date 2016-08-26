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

# Parameters
learning_rate = 0.001
training_epochs = 100
#batch_size = 50
#display_step = 1

# Network Parameters
n_hidden_1 = 256 # 1st layer number of features
n_hidden_2 = 128 # 2nd layer number of features
n_hidden_3 = 64 # 3rd layer number of features
n_hidden_4 = 128 # 4th layer number of features
n_input = 4 # Iris data input (img shape: 1*4)
n_classes = 3 # Iris total 3 classes

# tf Graph input
inp = tf.placeholder(tf.float32, [None, n_input])
y_ = tf.placeholder(tf.float32, [None, n_classes])


# Create model
def multilayer_perceptron(x, weights, biases):
    # Hidden layer1 with RELU activation
    layer_1 = tf.add(tf.matmul(x, weights['h1']), biases['b1'])
    layer_1 = tf.nn.relu(layer_1)
    # Hidden layer2 with RELU activation
    layer_2 = tf.add(tf.matmul(layer_1, weights['h2']), biases['b2'])
    layer_2 = tf.nn.relu(layer_2)
    # Hidden layer3 with RELU activation
    layer_3 = tf.add(tf.matmul(layer_2, weights['h3']), biases['b3'])
    layer_3 = tf.nn.relu(layer_3)
    # Hidden layer4 with RELU activation
    layer_4 = tf.add(tf.matmul(layer_3, weights['h4']), biases['b4'])
    layer_4 = tf.nn.relu(layer_4)
    # Output layer with linear activation
    out_layer = tf.matmul(layer_4, weights['out']) + biases['out']
    return out_layer

# Store layers weight & bias
weights = {
    'h1': tf.Variable(tf.random_normal([n_input, n_hidden_1])),
    'h2': tf.Variable(tf.random_normal([n_hidden_1, n_hidden_2])),
    'h3': tf.Variable(tf.random_normal([n_hidden_2, n_hidden_3])),
    'h4': tf.Variable(tf.random_normal([n_hidden_3, n_hidden_4])),
    'out': tf.Variable(tf.random_normal([n_hidden_4, n_classes]))
}
biases = {
    'b1': tf.Variable(tf.random_normal([n_hidden_1])),
    'b2': tf.Variable(tf.random_normal([n_hidden_2])),
    'b3': tf.Variable(tf.random_normal([n_hidden_3])),
    'b4': tf.Variable(tf.random_normal([n_hidden_4])),
    'out': tf.Variable(tf.random_normal([n_classes]))
}

# Construct model
y = multilayer_perceptron(inp, weights, biases)

# Define loss and optimizer
cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(y, y_))
#cost = -tf.reduce_sum(y_*tf.log(y))
train_step= tf.train.AdamOptimizer(learning_rate=learning_rate).minimize(cost)

# Initializing the variables
init = tf.initialize_all_variables()

# Launch the graph
with tf.Session() as sess:
    sess.run(init)

    # Training cycle
    keys = ['sepal_length', 'sepal_width','petal_length', 'petal_width']
    for epoch in range(training_epochs):
        train = trainingSet.sample(50)
        sess.run(train_step, feed_dict={inp: [x for x in train[keys].values],
                                         y_: [x for x in train['One-hot'].as_matrix()]})
    print("Optimization Finished!")

    # Test model
    correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
    # Calculate accuracy
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))
    print ("=accuracy=\n%s" % sess.run(accuracy, feed_dict={inp: [x for x in testSet[keys].values], 
                                    y_: [x for x in testSet['One-hot'].values]}))
    
