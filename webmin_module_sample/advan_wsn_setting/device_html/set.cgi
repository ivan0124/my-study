#!/usr/bin/perl

require '../myTest-lib.pl';
ui_print_header(undef);

print "<!DOCTYPE html>\n";
print "<html>\n";
#
print "<head>\n";
print "<title>Page Title</title>\n";
print "<script>";
print "function myFunction() {
    document.getElementById(\"demo\").innerHTML = \"change from 0017223344556677_Tempratue.cgi.\";
}";
print "</script>";
print "</head>\n";
#
print "<body>\n";

#read input cgi parameters

my $restful_path;
my $method;
my $content;
my $put_data;
my $put_data_type;
&ReadParse();
foreach $key (keys %in) {
    #print "<p>key= $key, value = $in{$key}</p>\n";
    if ( $key ne 'restful' && $key ne 'data_type' ){
      $restful_path = $key;
      $put_data = $in{$key};
    }
    if ( $key eq 'data_type' ){
      $put_data_type = $in{$key};
    }
    if ( $key eq 'restful' ){
      $method = $in{$key};
	  #print "<p>method = $method</p>\n";
    }	
};

$put_data ='{"'.$put_data_type.'":"'.$put_data.'"}';
#print "<p>put_data with type = $put_data</p>\n";

if ( $method eq "" ){
   $content= 'Method is empty';
   goto Exit;
}

## send curl to get/set data here
##
#print "<p>method===== $method</p>\n";
my $curl_method='';

if ( $method eq 'Get'){
    $curl_method = 'curl --connect-timeout 3 --max-time 30 -H "Content-Type: application/json" -X GET ';
}
                        
if ( $method eq 'Set'){
    #print "<p>PUT method===== $method</p>\n";
    #print "<p>PUT data===== $put_data</p>\n";
    $curl_method = 'curl --connect-timeout 3 --max-time 30 -H "Content-Type: application/json" -X PUT -d ' . '\''.$put_data .'\'' . ' ';
}

#curl --connect-timeout 3 -H "Content-Type: application/json" -X GET http://172.22.213.143:3000/restapi/wsnmanage/Connectivity/IoTGW/WSN/0007000E40ABCDEF/Info/reset |';
my $uri_type = 'http://';
my $restapi_server='127.0.0.1:3000';
my $resturi=$restful_path; 
my $curl_cmd = $curl_method . $uri_type . $restapi_server . '/restapi/wsnmanage/' . $resturi . ' |';
#print "curl_cmd ====== $curl_cmd \n";
#print "restful_path ====== $restful_path \n";
                    
open(CURL,$curl_cmd) || die "Failed: $!\n";
    

for($i=0; $line=<CURL>; $i++) {
    $content .= $line;
}
close(CURL);

# show curl get/set result here
my $exit_value = $?>>8;
#print "exit value == $exit_value\n";
if ( $exit_value == 0 ){
    #print "___ content = $content\n";
    #$uriout = $content;
}
else{
    
    $content = 'Not Found';
}

Exit:
print "<p id=\"demo\">RESTful path = $restful_path</p>";
print "<p id=\"content\">content = $content</p>";
#print "<button type=\"button\" onclick=\"myFunction()\">Try it</button>";

print "</body>\n";
print "</html>\n";

ui_print_footer("/", $text{'index'});
