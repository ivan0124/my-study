#!/usr/bin/perl

use Carp;
use Persistent::Memory;

eval {
    my $person = new Persistent::Memory($field_delimiter);
    ### set the data store ###
    $person->datastore($field_delimiter);

    ### get the data store ###
    $href = $person->datastore();
    print "href=$href\n"
};
croak "Exception caught: $@" if $@;
