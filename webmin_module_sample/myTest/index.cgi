#!/usr/bin/perl
# index.cgi
# Output HTML for the file manager applet

require './myTest-lib.pl';
ui_print_header(undef, $text{'index_title'}, "", undef, 1, 1);

print "<!DOCTYPE html>\n";
print "<html>\n";
print "<head>\n";
print "<title>Page Title</title>\n";
print "</head>\n";
print "<body>\n";

#
print "<form action=\"aaa.cgi\">\n";
  print "First name:<br>\n";
  print "<input type=\"text\" name=\"firstname\" value=\"Mickey\"><br>";
  print "<input type=\"text\" name=\"lastname\" value=\"Wang\"><br>";
  print "<input type=\"submit\" value=\"Submit\">\n";
print "</form>\n";
#

print "<h1>This is a Headingxxxxxxxxxx</h1>\n";
print "<p>This is a paragraph.</p>\n";

print "</body>\n";
print "</html>\n";

ui_print_footer("/", $text{'index'});
