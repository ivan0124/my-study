#!/usr/bin/python

import csv
import tensorflow as tf
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

print ("hello")
with tf.variable_scope("foo"):
    v = tf.get_variable("v", [1])

with tf.variable_scope("foo", reuse=True):
    v1 = tf.get_variable("v", [1])

assert v1 == v

print ("v.name = %s" % v.name)
print ("v1.name = %s" % v1.name)
