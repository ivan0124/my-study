#!/usr/bin/perl

    #open(CURL,'curl --connect-timeout 3 -H "Content-Type: application/json" -X GET http://admin:admin@172.22.12.7/restapi/APIInfoMgmt/APIS |') || die "Failed: $!\n";
    
    open(CURL,'curl --connect-timeout 3 -H "Content-Type: application/json" -X PUT -d \'{"sv":"curl_put_1234"}\' http://172.22.213.174:3000/restapi/wsnmanage/SenHub/0017000E4C000000/SenHub/Info/Name |') || die "Failed: $!\n";
    my $content;
    
    for($i=0; $line=<CURL>; $i++) {
        $content .= $line
    }
    close(CURL);

    my $exit_value = $?>>8;
    print "exit value = $exit_value\n";
    print "content = $content\n";
