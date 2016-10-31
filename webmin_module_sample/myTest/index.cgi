#!/usr/bin/perl
# index.cgi
# Output HTML for the file manager applet

require './myTest-lib.pl';
ui_print_header(undef);

print "<!DOCTYPE html>\n";
print "<html>\n";
print "<head>\n";
print "<title>Page Title</title>\n";
print "<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}
td{
    border: 1px solid #000000;
    text-align: left;
    padding: 8px;
}
th{
    border: 1px solid #000000;
    text-align: left;
    padding: 8px;    
    background-color: #dddddd;
}
tr{
    background-color: #ffffff;
}
</style>";

print "<script>";
print "function myUpdate() {
</style>
  var th{
        border: 1px solid #000000;
        text-align: left;
        padding: 8px;    
        background-color: #dddddd;
   }
</style>   
  //
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById(\"content\").innerHTML =  \
     '<tr> <th> Sensor Hub ID</th>' +\
     '<th> Connectivity type </th> <th> Connectivity ID</th> </tr>' + this.responseText;
    }
  };
  xhttp.open(\"GET\", \"data.cgi\", true);
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
