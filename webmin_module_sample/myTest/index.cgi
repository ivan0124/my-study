#!/usr/bin/perl
# index.cgi
# Output HTML for the file manager applet

require './myTest-lib.pl';
ui_print_header(undef, $text{'index_title'}, "", undef, 1, 1);

print "<!DOCTYPE html>\n";
print "<html>\n";
print "<head>\n";
print "<title>Page Title</title>\n";

$i = 0;
print "<script>";
print "function myUpdate() {
    document.getElementById(\"demo1\").innerHTML = \"change_name.\";
    
}";
print "</script>";

print "</head>\n";
print "<body onload = \"setInterval(myUpdate,3000)\">\n";

    my $dir = './device_data';

    opendir(DIR, $dir) or die $!;

    while (my $file = readdir(DIR)) {

        # Use a regular expression to ignore files beginning with a period
        next if ($file =~ m/^\./);

	#print "$file\n";
	open(my $fh, '<:encoding(UTF-8)', $file)
	  or die "Could not open file '$filename' $!";
	while (my $row = <$fh>) {
	  chomp $row;
	  print "$row\n";
	} 
	close($fs);	

    }

    closedir(DIR);
#
#my $filename = 'data.txt';
#open(my $fh, '<:encoding(UTF-8)', $filename)
#  or die "Could not open file '$filename' $!";
#while (my $row = <$fh>) {
#  chomp $row;
#  print "$row\n";
#} 
#close($fs);


#my $row = <$fh>;
#print "$row\n";
#
#print "<form action=\"aaa.cgi\">\n";
#  print "First name:<br>\n";
#  print "<input type=\"text\" name=\"firstname\" value=\"Mickey\"><br>";
#  print "<input type=\"text\" name=\"lastname\" value=\"Wang\"><br>";
#  print "<input type=\"submit\" value=\"Submit\">\n";
#print "</form>\n";
#

print "<h1>This is a Headingxxxxxxxxxx</h1>\n";
print "<p id=\"demo1\">This is a paragraph.</p>\n";

#my $filename = 'data.txt';
#open(my $fh, '<:encoding(UTF-8)', $filename)
#  or die "Could not open file '$filename' $!";
#while (my $row = <$fh>) {
#  chomp $row;
#  print "$row\n";
#} 
#close($fs);

print "</body>\n";
print "</html>\n";

ui_print_footer("/", $text{'index'});
