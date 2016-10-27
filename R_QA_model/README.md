#How to install R

1.installing R: [how-to-set-up-r-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-set-up-r-on-ubuntu-14-04)
<pre>
$ sudo apt-get update
$ sudo apt-get -y install r-base
</pre>



#How to test
1. generate and save trained `model.RData` file
<pre>
$ Rscript ./code.R
</pre>

2. load `model.RData` and predict `test_data.txt` HDD data
<pre>
$ Rscript ./myPredictCode.R
</pre>

