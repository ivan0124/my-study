#!/usr/bin/perl

#
$a=1001;
if ( "$a" == "100" ){
    print "\$a == 100\n";
}
else{
    print "\$a != 100\n";
}

# 如果指令(statement)只有一項，我們可以使用倒裝句法，看起來比較簡潔。
#statement if (Expression);
$name="friend";
print "HELLO!\n" if ($name eq "friend");
#
$x=100;
$x-=10 if ($x == 100);
print "x=$x\n";
 
# unless 就是if not
#statement unless (Expression);
$test="testaa";
print "Hello, not a test\n" unless ($test eq "test");
