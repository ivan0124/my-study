#!/usr/bin/perl

=pod
comment here:
This is a hello perl.
Welcome !!
=cut

open(LISTMOTE, "cat ./info.txt |");
for($i=0; $line=<LISTMOTE>; $i++) {
        chop($line);
        $line =~ s/^\s+//g;
        @w = split(/\s+/, $line);
        $plist[$i]->{"mac"} = $w[0];
        $plist[$i]->{"moteid"} = $w[1];
        $plist[$i]->{"state"} = $w[2];
        if($w[3]) {
        	$plist[$i]->{"routing"} = "YES";
    	} else {
        	$plist[$i]->{"routing"} = "NO";
		}
        $plist[$i]->{"reliability"} = $w[4];
        $plist[$i]->{"latency"} = $w[5];
        }
close(LISTMOTE);

foreach $pr (@plist){
    local @cols;
    push(@cols, $pr->{'mac'});   
    push(@cols, $pr->{'moteid'});
    push(@cols, $pr->{'state'}); 
    push(@cols, $pr->{'routing'});
    push(@cols, $pr->{'reliability'});
    push(@cols, $pr->{'latency'});          
    print "@cols\n";
}
