#!/usr/bin/perl

use strict;
use JSON;

#encode json
my @item;
push(@item, {JoinKey => "JOINADVANTECHIOT", NetID => "2001"});
push(@item, {JoinKey => "JOINADVANTECHIOT", NetID => "2002"});
my $json_array_str = encode_json({'result' => {action =>2,item => \@item}});
print "$json_array_str\n";

#
my %rec_hash = ('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
my $json = encode_json(\%rec_hash);
print "$json\n";

#

my $decoded_json = decode_json($json_array_str);
my $itmes=$decoded_json->{'result'}->{'item'};
                        
print "$decoded_json->{'result'}->{'action'}\n";
print "$decoded_json->{'result'}->{'item'}\n";
print "$decoded_json->{'result'}->{'item'}[0]->{'NetID'}\n";
print "$decoded_json->{'result'}->{'item'}[1]->{'NetID'}\n";
for my $it ( @$itmes ) {
    my $NetID     = $it->{NetID};
    print "NetID=$NetID\n"
}
