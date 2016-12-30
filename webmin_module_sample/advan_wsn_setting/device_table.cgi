#!/usr/bin/perl

require './myTest-lib.pl';
ui_print_header(undef);

    my $css_file = "./style.css";
    #print "$css_file\n";
    open(my $fh_css, '<:encoding(UTF-8)', $css_file)
      or die "Could not open file '$css_file' $!";
    while (my $row_css = <$fh_css>) {
      chomp $row_css;
      print "$row_css\n";
    } 
    close($fh_css);
#print "Content-type:text/html\r\n\r\n";
#print "<div id=\"content\">";
    my $dir = './device_table';

    opendir(DIR, $dir) or die $!;

    while (my $file = readdir(DIR)) {

        # Use a regular expression to ignore files beginning with a period
        if ($file =~ m/^\./){
    	  next;
    	}
    	else{
          
	  #print HTML file
    	  my $path = "$dir/$file";
    	  #print "$path\n";
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

