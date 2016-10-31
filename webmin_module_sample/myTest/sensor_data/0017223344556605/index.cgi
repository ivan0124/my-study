#!/usr/bin/perl
# data.cgi
# Output HTML for the file manager applet

require '../../myTest-lib.pl';
ui_print_header(undef);

print "<p> 0017223344556605 sesnro hub get/set page.</p>";
    my $html_file = "./index.htm";
    print "$html_file\n";
    open(my $fh_html, '<:encoding(UTF-8)', $html_file)
      or die "Could not open file '$html_file' $!";
    while (my $row_html = <$fh_html>) {
      chomp $row_html;
      print "$row_html\n";
    } 
    close($fh_html);
