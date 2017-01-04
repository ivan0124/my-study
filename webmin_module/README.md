# How to packaging single modules for Webmin
- go to each module directory and follow the README.md install steps

# How to packaging multiple modules for Webmin
- for example: 

  we have 2 module `wisecloud` and `wisecloud_status` and packaging as  `my_module.wbm.gz` for Webmin
<pre>
$ tar cvzf my_module.wbm.gz ./wisecloud ./wisecloud_status/
</pre>

# How to install Webmin module
- check Webmin how to install module from web page:

https://github.com/ivan0124/my-study/wiki/webmin-formal-method-to-add-module       


