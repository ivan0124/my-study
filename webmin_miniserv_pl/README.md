1. svn source code location:
<pre>
$ https://172.20.2.44/svn/essrisc/iMX6/Linux/Gateway/WISE-3310/fsl-yocto-3.10.17_1.0.0/fsl-release-bsp
</pre>

2. svn `miniserv.pl` location:
<pre>
$ ~fsl-release-bsp/sources/meta-advantech/recipes-webadmin/webmin/webmin/restapi/miniserv.pl
</pre>

3. svn `miniserv.conf` locatioin:
<pre>
$ ~fsl-release-bsp/sources/meta-advantech/recipes-webadmin/webmin/webmin/default-config/etc/webmin/miniserv.conf
</pre>

4. use ssh to copy file to wise-3310
<pre>
$ scp ./miniserv.pl  root@172.22.12.7:/usr/lib/webmin/webmin
$ scp ./miniserv.conf root@172.22.12.7:/etc/webmin/
</pre>
