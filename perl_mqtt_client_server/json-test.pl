#!/usr/bin/perl

use strict;
use JSON;

#
my @item;
push(@item, {JoinKey => "JOINADVANTECHIOT", NetID => "2001"});
push(@item, {JoinKey => "JOINADVANTECHIOT", NetID => "2002"});
my $json_array_str = encode_json({action =>2,item => \@item});
print "$json_array_str\n";

#
my %rec_hash = ('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
my $json = encode_json(\%rec_hash);
print "$json\n";


