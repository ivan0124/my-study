#!/usr/bin/perl

require '../myTest-lib.pl';
ui_print_header(undef);

my $device_id;
&ReadParse();
foreach $key (keys %in) {
    #print "<p>key= $key, value = $in{$key}</p>\n";
    if ( $key eq 'device_id'){
        $device_id = $in{$key};
        print "<p>Device ID= $device_id</p>\n";
    }
};
    my $html_file = "./$device_id/index.htm";
    #print "$html_file\n";
    open(my $fh_html, '<:encoding(UTF-8)', $html_file)
      or die "Could not open file '$html_file' $!";
    while (my $row_html = <$fh_html>) {
      chomp $row_html;
      print "$row_html\n";
    } 
    close($fh_html);
