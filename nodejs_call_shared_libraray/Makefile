#Makefile
CC :=gcc
CFLAGS	:=-shared -fPIC
LDFLAGS :=-L./
LDLIBS 	:=
LIB_NAME :=lib_a.so

SRC=$(wildcard *.c)
$(warning SRC=$(SRC))

all:
	$(CC) $(CFLAGS) $(LDFLAGS) $(LDLIBS) $(SRC) -o $(LIB_NAME)

clean:
	rm -rf *.o
	rm -rf *.so
