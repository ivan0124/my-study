#!/usr/bin/perl
# index.cgi
# Output HTML for the file manager applet

require './myTest-lib.pl';
ui_print_header(undef);

print "<!DOCTYPE html>\n";
print "<html>\n";
print "<head>\n";
print "<title>Page Title</title>\n";

print "<script>";
print "function myUpdate() {  
  //
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById(\"content\").innerHTML =  \
     '<tr> <th> Device ID</th> <th> Device type </th>' +\
     '<th> Connected connectivity ID </th> <th> Connected connectivity Type</th> </tr>' + this.responseText;
    }
  };
  var now = new Date();
  xhttp.open(\"GET\", \"device_table.cgi?request=\" +now, true);
  xhttp.send();
  setTimeout(myUpdate,3000)
}";

print "</script>";

print "</head>\n";
print "<body onload = \"setTimeout(myUpdate,0)\">\n";

print "<table id=\"content\">";
#print "<tr> <th>Sensor Hub ID</th> <th> Connectivity type </th> <th> Connectivity ID</th> </tr>";
print "</table>\n";


print "</body>\n";
print "</html>\n";

ui_print_footer("/", $text{'index'});
