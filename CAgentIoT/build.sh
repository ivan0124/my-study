#!/bin/sh
#./buildjson.sh
#./buildlog.sh
rm -rf out

cd AdvLog
./configure
cd ./Tools/AdvJSON
./configure
cd ../../

cd ./Tools/AdvLog
./configure
cd ../../
rm -rf _install
make clean
#./configure $CONF_FLAGS
make install DESTDIR=`pwd`/_install
mkdir ../out
if [ -d _install ] ; then
    cp _install/usr/lib/libAdvJSON.a ../out
    cp _install/usr/lib/libAdvLog.a ../out
    cd ../out
    ar -x libAdvJSON.a
    ar -x libAdvLog.a
fi
