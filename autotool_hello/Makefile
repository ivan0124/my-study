#Makefile
include ./.config
MSG=This is test message
$(warning my check MSG=$(MSG))

ifeq ($(CONFIG_ARM),y)
$(warning my check CONFIG_ARM=yes)
else
$(warning my check CONFIG_ARM=no)
endif

all:hello

clean:
	rm -rf hello *.o
