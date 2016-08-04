# C call Python project
This sample demo how to use C to call python object

#Setup Python header files (on Unbutun14.04)
<pre>
sudo apt-get install python-dev
</pre>

![image link](https://github.com/ivan0124/my-study/blob/master/autotool_hello/image/autotool_20160511_1.png)

# Step Flow
1. write `Makefile.am` for generating `Makefile.in`
    
    top level Makefile: [Makefile.am](https://github.com/ivan0124/my-study/edit/master/autotool_hello_shared_library/Makefile.am)
    
    src directory Makefile: [src/Makefile.am](https://github.com/ivan0124/my-study/edit/master/autotool_hello_shared_library/src/Makefile.am)

2. generate `configure.ac` for generating `configure`
<pre>
$autoscan
$mv configure.scan configure.ac
</pre>

3. add macro `configure.ac` for auto creating `Makefile`
<pre>
...
AC_CONFIG_AUX_DIR([build-aux])
AC_CONFIG_MACRO_DIR([m4])
AM_INIT_AUTOMAKE([foreign -Wall])
...
AM_PROG_AR
LT_INIT
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
$automake
</pre>

# How to test
1. generating `aclocal.m4` for generating `configure`
<pre>
$aclocal
</pre>

2. generating `configure`
<pre>
$autoconf
</pre>

3. generating `Makefile.in`
<pre>
$automake
</pre>

4. using `configure` generate `Makefile`
<pre>
$./configure
</pre>

5. using `make` to build code
<pre>
$make
</pre>

6. running `hello` program
<pre>
$cd src
$./hello
</pre>
