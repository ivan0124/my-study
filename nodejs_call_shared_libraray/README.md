#How to build NodeJS C addon
Tutorial

http://stackabuse.com/how-to-create-c-cpp-addons-in-node/

#How to setup environment
1.install nan
<pre>
$ sudo npm install nan
</pre>

#How to build code
1. using `node-gyp`, generate the appropriate project build files for the given platform:
<pre>
$ node-gyp configure
</pre>

2. build code
<pre>
$ node-gyp build
</pre>

#How to test
1. run index.js
<pre>
$ node ./index.js
</pre>

