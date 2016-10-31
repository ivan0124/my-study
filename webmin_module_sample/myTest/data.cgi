#!/usr/bin/perl
# data.cgi
# Output HTML for the file manager applet

require './myTest-lib.pl';
ui_print_header(undef);

#print "Content-type:text/html\r\n\r\n";
#print "<div id=\"content\">";
    my $dir = './device_data';

    opendir(DIR, $dir) or die $!;

    while (my $file = readdir(DIR)) {

        # Use a regular expression to ignore files beginning with a period
        if ($file =~ m/^\./){
    	  next;
    	}
    	else{
          
	  #print HTML file
    	  my $path = "$dir/$file";
    	  print "$path\n";
    	  open(my $fh, '<:encoding(UTF-8)', $path)
    	    or die "Could not open file '$path' $!";
    	  while (my $row = <$fh>) {
    	    chomp $row;
    	    print "$row\n";
    	  } 
    	  close($fh);
    	}

    }

    closedir(DIR);
#print "</div>";

