# install R environment

1.installing R: [how-to-set-up-r-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-set-up-r-on-ubuntu-14-04)
<pre>
$ sudo apt-get update
$ sudo apt-get -y install r-base
</pre>

# install nodejs module
<pre>
$ npm install mqtt --save
$ npm install keypress -- save
</pre>

#How to test
1. generate and save trained `Model.RData` file
<pre>
$ Rscript ./TrainModel.R
</pre>

2. load `Model.RData` and predict HDD `Feature.data`
<pre>
$ Rscript ./PredictionModel.R
</pre>

#Use NodeJS to test
1. use NodeJS app to communicate with `PredictionModel.R`. MUST use nodejs `v4.6.2`
<pre>
$ node ./app.js
</pre>

