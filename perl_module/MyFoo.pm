#!/usr/bin/perl

#use strict;

package MyFoo;

require Exporter;
@ISA = qw(Exporter);
@EXPORT = qw(bar $ttt);  # 默认导出的符号

sub bar { 
   print "Hello $_[0]\n"; 
}

$ttt=5;

1;
