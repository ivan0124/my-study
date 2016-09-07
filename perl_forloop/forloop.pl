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

# last是跳出現在所在的迴圈，next則是跳過下面的指令直接執行下一次的迴圈。
$i=0;
while($i<=20) {
    $i++;
    if ($i <= 5){
        print "continue loop. i=$i\n";
        next;
    }
    print "i=$i\n";
    if ($i > 10){
        print "exit loop. i=$i\n";
        last;
    }
}
