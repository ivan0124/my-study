#!/usr/bin/perl

require './myTest-lib.pl';
ui_print_header(undef, $text{'index_title'}, "", undef, 1, 1);

print "<!DOCTYPE html>\n";
print "<html>\n";
print "<head>\n";
print "<title>Page Title</title>\n";
print "</head>\n";
print "<body>\n";

&ReadParse();

print "in = $in{'name'}\n";
print "<h1>This is a aaa.cgi YYYYYYYYY~~</h1>\n";

print "</body>\n";
print "</html>\n";

ui_print_footer("/", $text{'index'});