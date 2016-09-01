#!/usr/bin/python

import csv
import tensorflow as tf
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys

# Print iterations progress
def printProgress (iteration, total, prefix = '', suffix = '', decimals = 1, barLength = 100):
    formatStr       = "{0:." + str(decimals) + "f}"
    percents        = formatStr.format(100 * (iteration / float(total)))
    filledLength    = int(round(barLength * iteration / float(total)))
    bar             = '>' * filledLength + '-' * (barLength - filledLength)
    sys.stdout.write('\r%s |%s| %s%s %s' % (prefix, bar, percents, '%', suffix)),
    sys.stdout.flush()
    if iteration == total:
        sys.stdout.write('\n')
        sys.stdout.flush()

def main():
    print ("Step1: load data path=./iris.csv...\n")
    ipd = pd.read_csv("./iris.csv")
    ipd.head()

    '''
    plt.subplot(2,1,1)
    for key,val in ipd.groupby('Species'):
        plt.plot(val['sepal_length'], val['sepal_width'], label=key, linestyle="none",  marker='.')
    plt.xlabel('Sepal Length')
    plt.ylabel('Sepal Width')


    plt.subplot(2,1,2)
    for key,val in ipd.groupby('Species'):
        plt.plot(val['petal_length'], val['petal_width'], label=key, linestyle="none",  marker='.')
    plt.xlabel('Petal Length')
    plt.ylabel('Petal Width')   

    plt.legend(loc='best')
    plt.show()
    '''

    print ("Step2: Label species...\n")
    species = list(ipd['Species'].unique())
    ipd['One-hot'] = ipd['Species'].map(lambda x: np.eye(len(species))[species.index(x)] )
    #print ("ipd.sample(5)=\n%s" % (ipd.sample(5)))

    #split the data into training and test sets
    print ("Step3: Split the data into training and test sets...\n")
    shuffled = ipd.sample(frac=1)
    trainingSet = shuffled[0:len(shuffled)-50]
    testSet = shuffled[len(shuffled)-50:]
    #train = trainingSet.sample(50)
    #print ("train=\n%s" % (train))

    #build Graph
    print ("Step4: Build TensorFlow graph...\n")
    inp = tf.placeholder(tf.float32, [None, 4])
    weights = tf.Variable(tf.zeros([4, 3]))
    bias = tf.Variable(tf.zeros([3]))

    #Activation Function is --> softmax()
    y = tf.nn.softmax(tf.matmul(inp, weights) + bias)

    #y_ is correct label
    y_ = tf.placeholder(tf.float32, [None, 3])

    #cost function
    cross_entropy = -tf.reduce_sum(y_*tf.log(y))

    #set optimizer algorithm
    train_step = tf.train.AdamOptimizer(0.01).minimize(cross_entropy)

    #set accuracy graph
    correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))

    #add logs
    print ("Step5: Add TensorBoard logs...\n")
    tf.scalar_summary('Cost function', cross_entropy)
    tf.scalar_summary('Accuracy', accuracy)
    merged_summary_op = tf.merge_all_summaries()

    print ("Step6: Initialized variabel and session...\n")
    init = tf.initialize_all_variables()

    sess = tf.Session()
    sess.run(init)

    #set logs write path
    summary_writer = tf.train.SummaryWriter('./logs/train', sess.graph)
    test_writer = tf.train.SummaryWriter('./logs/test')

    #train neural model
    print ("Step7: Start fit...\n")
    epochs=1000
    keys = ['sepal_length', 'sepal_width','petal_length', 'petal_width']
    for i in range(epochs):
        if i%50 == 0:
            printProgress(i, epochs, prefix = 'Progress:', suffix = 'Complete', barLength = 50)

        train = trainingSet.sample(50)
        summary_str, _ = sess.run([merged_summary_op, train_step], feed_dict={inp: [x for x in train[keys].values],
                                                         y_: [x for x in train['One-hot'].as_matrix()]})
        summary_writer.add_summary(summary_str, i)

        test_str, acc = sess.run([merged_summary_op, accuracy], feed_dict={inp: [x for x in testSet[keys].values],
                                                         y_: [x for x in testSet['One-hot'].values]})
        test_writer.add_summary(test_str, i)

    printProgress(epochs, epochs, prefix = 'Progress:', suffix = 'Complete', barLength = 50)
    
    #print train result

    print ("\nStep8: Show fit result:\n")
    print ("=accuracy=\n%s" % sess.run(accuracy, feed_dict={inp: [x for x in testSet[keys].values], 
                                    y_: [x for x in testSet['One-hot'].values]}))

    print ("=weight=\n%s" % sess.run(weights))
    print ("=bias=\n%s" % sess.run(bias))

    #train = trainingSet.sample(50)
    #print ("train['One-hot'].as_matrix()=\n%s" % ([x for x in train['One-hot'].as_matrix()]))

'''
#test accuracy
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
#test lambda method
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

'''
#test --> y_data = tf.matmul(x_data, W)+b
x_data=[[1.,1.],
        [2.,2.],
        [3.,3.]]
W=[[1.],
   [2.]]

b=[[1.],
   [2.],
   [3.]]

y_data = tf.matmul(x_data, W)+b

print ("y_data=%s" % sess.run(y_data))
'''

if __name__  == "__main__":
    main()
