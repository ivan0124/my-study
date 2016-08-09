#                                               -*- Autoconf -*-
# Process this file with autoconf to produce a configure script.

m4_define([ver_current], [1])
m4_define([ver_revision], [0])
m4_define([ver_age], [0])
m4_define([lib_version],[ver_current.ver_revision.ver_age])

AC_PREREQ([2.68])
AC_INIT([MqttDrv], [lib_version], [BUG-REPORT-ADDRESS])
AC_CONFIG_AUX_DIR([build-aux])
AC_CONFIG_MACRO_DIR([m4])
AM_INIT_AUTOMAKE([foreign -Wall])
AC_CONFIG_SRCDIR([src/mqtt_client_shared.c])
AC_CONFIG_HEADERS([config.h])
AC_SUBST([LIB_VERSION], [ver_current:ver_revision:ver_age])

# Checks for programs.
AC_PROG_CC
AC_PROG_CXX
AM_PROG_CC_C_O
AM_PROG_AR
LT_INIT

# Checks for libraries.
# FIXME: Replace `main' with a function in `-ldl':
AC_CHECK_LIB([dl], [dlopen])
# FIXME: Replace `main' with a function in `-lpthread':
AC_CHECK_LIB([pthread], [pthread_create])
# FIXME: Replace `main' with a function in `-lrt':
AC_CHECK_LIB([rt], [clock_gettime])
AC_CHECK_LIB([mosquitto], [mosquitto_lib_init])

# Checks for header files.
AC_CHECK_HEADERS([fcntl.h limits.h netinet/in.h stdint.h stdlib.h string.h sys/ioctl.h sys/socket.h sys/time.h termios.h unistd.h wchar.h])

# Checks for typedefs, structures, and compiler characteristics.
AC_HEADER_STDBOOL
AC_TYPE_INT32_T
AC_TYPE_INT8_T
AC_TYPE_MODE_T
AC_TYPE_PID_T
AC_TYPE_SIZE_T
AC_TYPE_UINT16_T
AC_TYPE_UINT32_T
AC_TYPE_UINT8_T

# Checks for library functions.
AC_FUNC_FORK
AC_FUNC_MALLOC
AC_CHECK_FUNCS([clock_gettime gettimeofday inet_ntoa memmove memset mkdir socket strcasecmp strchr strdup strrchr strstr strtol sysinfo])

AC_CONFIG_FILES([Makefile
                 src/Makefile
		 data/Makefile
		 TestApp/Makefile
		 ])
AC_OUTPUT
