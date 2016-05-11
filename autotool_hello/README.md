# autotool hello Project
This sample demo how to use autotool to generate `configure`,

which can auto generate `Makefile` for different platform.

# Step Flow
1. write `Makefile.am` for generating `Makefile.in`
    
    top level Makefile: [Makefile.am](https://github.com/ivan0124/my-study/blob/master/autotool_hello/Makefile.am)
    
    src directory Makefile: [src/Makefile.am](https://github.com/ivan0124/my-study/blob/master/autotool_hello/src/Makefile.am)

2. generate configure.ac
<pre>
$autoscan
$mv configure.scan configure.ac
</pre>

3. add macro `configure.ac` for auto creating `Makefile`
<pre>
...
$AM_INIT_AUTOMAKE([-Wall -Werror foreign])
...
</pre>

4. generating `aclocal.m4` for generating `configure`
<pre>
$aclocal
</pre>

5. generating `configure`
<pre>
$autoconf
</pre>

6. generating `Makefile.in`
<pre>
$automake --add-missin
</pre>

# How to test
1. using `configure` generate `Makefile`
<pre>
$./configure
</pre>

2. using `make` to build code
<pre>
$make
</pre>

3. running `hello` program
<pre>
$cd src
$./hello
</pre>
