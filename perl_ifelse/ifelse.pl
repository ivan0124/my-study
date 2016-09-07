#!/usr/bin/perl

#
@array=("a","b","c","d");

print "run for loop ===>\n";
for($i=0; $i<=$#array; $i++) {
    print "array[$i]=$array[$i]\n";
}

#
print "run foreach loop ===>\n";
foreach $i (@array) {
    print "$i\n";
}

#
print "run foreach loop(0..3) ===>\n";
foreach $i (0..3) {
    print "array[$i]=$array[$i]\n";
}

#
print "while loop ===>\n";
$i=0;
while($i<=3) {
    print "array[$i]=$array[$i]\n";
    $i++;
}
