#!/usr/bin/perl

# 相關陣列是以 % 符號開頭的。
my %hash;

# => 這個符號是Perl5新增的，是為了相關陣列量身定做的，
# 因為索引和元素值都是純量，若使用 => 這個符號，
# (索引=>元素值) 兩兩對應，就不容易發生失誤。
my %hash=("i1"=>"aaa","i2"=>"bbb","i3"=>"ccc");

print "$hash{'i1'}\n";

#
print "---------------\n";
foreach $key (keys %hash) {
    print "$hash{$key}\n";
};
#
print "---------------\n";
foreach $value (values %hash){
    print "$value\n"
};
