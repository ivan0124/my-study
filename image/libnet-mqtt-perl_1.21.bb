DESCRIPTION = "libnet-mqtt-perl is a minimal MQTT version 3 Perl modules."
SUMMARY = "Minimal MQTT version 3 interface."
SECTION = "libs"
LICENSE = "GPL-1.0+"
PR = "r1"

LIC_FILES_CHKSUM = "file://README;md5=ba1809738dd7da48c3c00bcaa12a28a9"

SRC_URI = "http://search.cpan.org/CPAN/authors/id/J/JU/JUERD/Net-MQTT-Simple-${PV}.tar.gz"

SRC_URI[md5sum] = "5b2c5748c394564f2c88a75e3b0fc44b"
SRC_URI[sha256sum] = "25ad4f62d89e183e00421dadfe5309f3cefcaa607918500b75dd7ac8dd34ddee"

S = "${WORKDIR}/Net-MQTT-Simple-${PV}"

EXTRA_CPANFLAGS = "EXPATLIBPATH=${STAGING_LIBDIR} EXPATINCPATH=${STAGING_INCDIR}"

inherit cpan

do_compile() {
	export LIBC="$(find ${STAGING_DIR_TARGET}/${base_libdir}/ -name 'libc-*.so')"
	cpan_do_compile
}

BBCLASSEXTEND = "native"
