iotgwdir = $(prefix)/lib/Advantech/iotgw
iotgw_LTLIBRARIES = libMqttDrv.la

libMqttDrv_la_CFLAGS = -I../include -I../../../inc -I../../../Tools/AdvLog/include -I../../../Tools/AdvJSON/inc -fPIC -Wall -ggdb -O2 -DWITH_TLS -DWITH_TLS_PSK -DWITH_SOCKS -DWITH_SRV -DWITH_THREADING

libMqttDrv_la_CPPFLAGS = -I../include -I../../../inc -I../../../Tools/AdvLog/include -I../../../Tools/AdvJSON/inc -fPIC -Wall -ggdb -O2 -DWITH_TLS -DWITH_TLS_PSK -DWITH_SOCKS -DWITH_SRV -DWITH_THREADING

libMqttDrv_la_LIBADD = ../../../Tools/AdvLog/src/libAdvLog.la ../../../Tools/AdvJSON/src/libAdvJSON.la

libMqttDrv_la_SOURCES = mqtt_client_shared.c \
						list.c \
						DataProc.c \
						MqttHal.c \
                        SensorNetwork_API.c

libMqttDrv_la_LDFLAGS = -version-info $(LIB_VERSION)
