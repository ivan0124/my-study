#!/usr/bin/python

import csv
import tensorflow as tf
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

ipd = pd.read_csv("./iris.csv")
ipd.head()


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


