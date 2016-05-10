# hello Makefile Project
This is a simple Makefile and has following tips

# Code Description

1. show how to print variable in Makefile ( for debug)
<pre>
MSG=This is test message
$(warning my check MSG=$(MSG))
</pre>
2. show how to include .config file in Makefile
<pre> include ./.config </pre>
3. show how to use 'if...else...' in Makefile
<pre>
ifeq ($(CONFIG_ARM),y)
$(warning my check CONFIG_ARM=yes)
else
$(warning my check CONFIG_ARM=no)
endif
</pre>

# How To Test
Typing 'make' and see the message in screen

`#make`

