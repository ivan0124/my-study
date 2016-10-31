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
  //Remove all child of the div
  el =  document.getElementById(\"content\");
  if ( el.hasChildNodes() )
  {
    while ( el.childNodes.length >= 1 )
    {
       el.removeChild( el.firstChild );       
    } 
  }
  //
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById(\"content\").innerHTML = this.responseText;
    }
  };
  xhttp.open(\"GET\", \"index.cgi\", true);
  xhttp.send();
}";

print "</script>";

print "</head>\n";
print "<body onload = \"setInterval(myUpdate,3000)\">\n";

print "<div id=\"content\">";
    #my $dir = './device_data';

    #opendir(DIR, $dir) or die $!;

    #while (my $file = readdir(DIR)) {

        # Use a regular expression to ignore files beginning with a period
    #    if ($file =~ m/^\./){
    #	  next;
    #	}
    #	else{
          
	  #print HTML file
    #	  my $path = "$dir/$file";
    #	  print "$path\n";
    #	  open(my $fh, '<:encoding(UTF-8)', $path)
    #	    or die "Could not open file '$path' $!";
    #	  while (my $row = <$fh>) {
    #	    chomp $row;
    #	    print "$row\n";
    #	  } 
    #	  close($fh);
    #	}

#    }

#    closedir(DIR);
print "</div>";

#print "<h1>This is a Headingxxxxxxxxxx</h1>\n";
#print "<p id=\"demo1\">This is a paragraph.</p>\n";


print "</body>\n";
print "</html>\n";

ui_print_footer("/", $text{'index'});
