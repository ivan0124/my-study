# autotool hello Project
This sample demo how to use autotool to generate `configure`,

which can auto generate `Makefile` for different platform.

# Step Flow
1. write `Makefile.am` for `configure` auto creating Makefile

top level Makefile: [Makefile.am](https://github.com/ivan0124/my-study/blob/master/autotool_hello/Makefile.am)

src directory Makefile: [src/Makefile.am](https://github.com/ivan0124/my-study/blob/master/autotool_hello/src/Makefile.am)

2. generate configure.ac
<pre>
$autoscan
$mv configure.scan configure.ac
</pre>

3.add macro `configure.ac` for auto creating `Makefile`
<pre>
...
$AM_INIT_AUTOMAKE([-Wall -Werror foreign])
...
</pre>

`#make`

