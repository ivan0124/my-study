#!/usr/bin/python

import numpy as np
import configparser
import sys

class Perceptron(object):

   def __init__(self, eta=0.01, n_iter=10):
      self.eta = eta
      self.n_iter = n_iter
   
   def fit(self, X, y):
      self.w_ = np.zeros(1 + X.shape[1])
      self.errors_ = []
  
      for _ in range(self.n_iter):
          errors = 0
          for xi, target in zip(X,y):
              update = self.eta * (target - self.predict(xi))
              self.w_[1:] += update * xi
              self.w_[0] += update
              errors += int(update != 0.0)
          self.errors_.append(errors)
      return self

   def net_input(self, X):
       return np.dot(X, self.w_[1:]) + self.w_[0]

   def predict(self, X):
       return np.where(self.net_input(X) >= 0.0, 1, -1)

   def get_w(self):
       return self.w_

   def set_w(self, w):
       self.w_ = w

def set_weight(config_path_name):

    #config = configparser.ConfigParser()
    #config.read(config_path_name)
    #a=config['DEFAULT']['weight']
    a=config_path_name

    floats = map(float, a.split(','))

    ppn.set_w( np.array(floats))
    Weight=ppn.get_w();
    #print("get Weight = %s" % Weight);
    return 0

def predict(X):
    floats = map(float, X.split(','))
    X_point=np.array(floats)
    predict=ppn.predict(X_point);
    print("data [T H]=%s,%d,%s" % (X_point,predict,ppn.get_w()))
    return predict


def main():
    #print 'Number of arguments:', len(sys.argv), 'arguments.'
    #print 'Argument List:', str(sys.argv[2])
    set_weight(str(sys.argv[2]))
    #set_weight("FILE.INI")
    predict(str(sys.argv[1]))
 
if __name__  == "__main__":
    ppn = Perceptron(eta=0.3, n_iter=10)
    main()
else:
    print("pla.py is loaded.");
    ppn = Perceptron(eta=0.3, n_iter=10)
