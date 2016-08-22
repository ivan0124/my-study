#!/usr/bin/python

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import configparser
import ast
from matplotlib.colors import ListedColormap
from pla import Perceptron

def plot_decision_regions(X, y, classifier, resolution=0.02): 
    markers = ('x', 'o', 'o', '^', 'v')
    colors = ('red', 'blue', 'lightgreen', 'gary', 'cyan')
    cmap = ListedColormap(colors[:len(np.unique(y))])
    #plot the decision surface
    
    x1_min, x1_max = X[:, 0].min()-1, X[:, 0].max()+1
    x2_min, x2_max = X[:, 1].min()-1, X[:, 1].max()+1
    xx1, xx2 = np.meshgrid(np.arange(x1_min, x1_max, resolution), 
                           np.arange(x2_min, x2_max, resolution))

    Z = classifier.predict(np.array( [xx1.ravel(), xx2.ravel()]).T)
    Z = Z.reshape(xx1.shape)

    plt.contourf(xx1,xx2, Z, alpha=0.4, cmap=cmap)
    plt.xlim(xx1.min(), xx1.max())
    plt.ylim(xx2.min(), xx2.max())

    for idx, cl in enumerate(np.unique(y)):
        plt.scatter(x=X[y == cl, 0], y=X[y == cl, 1],
                    alpha=0.8, c=cmap(idx),
                    marker=markers[idx], label=cl)

def main():
    
    df = pd.read_csv('./sensor.data',header=None)
    df.tail();

    y = df.iloc[0:99, 2].values
    y = np.where(y == 'Abnormal', -1, 1)
    X = df.iloc[0:99, [0,1]].values

    ppn = Perceptron(eta=0.1, n_iter=10) 
    #ppn.fit(X,y)
    
    config = configparser.ConfigParser()
    config.read('FILE.INI')
    print(config['DEFAULT']['weight'])
    a=config['DEFAULT']['weight']

    #a='-0.4,-0.66,1.44'
    print(a)
    floats = list(map(float, a.split(',')))
    print('------------');
    print(floats)
    print('------------');

    ppn.set_w( np.array(floats))
    Weight=ppn.get_w();
    print("fit weight W = %s" % Weight)
   
    print("----------")
    X_point=np.array([50,23.5])
    predict=ppn.predict(X_point);
    print("X_point = %s, predict result = %d" % (X_point,predict))
    X_point=np.array([50,20])
    predict=ppn.predict(X_point);
    print("X_point = %s, predict result = %d" % (X_point,predict))
    
    plot_decision_regions(X, y, classifier=ppn)
    plt.xlabel('Temperature')
    plt.ylabel('Humidity')
    plt.legend(loc='upper left')
    plt.show();        
   
 
print ("__name__ value is %s" % (__name__))

if __name__  == "__main__":
    main()
