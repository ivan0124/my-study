#!/usr/bin/perl

# 陣列(array)

# (1) 陣列：'@' 開頭，一連串的純量

@empty = ();    # 空陣列

# 一陣列內含兩元素 "Bill" "Mary"
@arr1 = ("Bill","Mary");

# @arr2 = ("Bill","Mary","John")
@arr2 = (@arr1,"John");

# @arr3 = ("John","Mary","Bill")
@arr3 = reverse @arr2;

# 按照 ASCII 碼排序，@arr4 = ("Bill","John","Mary")
@arr4 = sort @arr2;

print $arr1[1];         # "Mary"
print $#arr2;           # @arr2 最後一個元素的 index 即 2
print $arr2[$#arr2];        # @arr2 最後一個元素
print $arr2[-2];        # @arr2 倒數第二個元素

@arr4 = ("a","b","c","d","e","f");
@arr5 = @arr4[2..4];        # 取出 @arr4 第三到第五個元素

($a,$b) = ($b,$a);      # 交換 $a 與 $b


# (2) 純量與陣列語境

@array = ("a","b","c");     # 陣列
$scalar1 = @array;      # Perl 會傳回 @array 的長度
$scalar2 = sort @array;     # Perl 會傳回 undef
$scalar3 = reverse @array;  # Perl 會傳回 "cba"
$scalar4 = "@array";        # Perl 會傳回 "a b c"

$scalar = "a";          # 純量
($scalar);          # 陣列，元素個數為一


# (3) pop,push,shift,unshift 陣列處理

@arr = (0,1);
push(@arr,2);   # push 後，@arr = (0,1,2)
$a = pop(@arr); # pop 後，@arr = (0,1)，$a = 2

@arr = (0,1);
unshift(@arr,2);    # unshift 後，@arr = (2,0,1)
$a = shift(@arr);   # shift 後，@arr = (0,1)，$a = 2

# (4) split,join
$str = "It's my life.";

# 以空白做分隔，將 $str 切成陣列，存入 @arr 
@arr = split / /,$str;

# 以 "-" 作分隔，將 @arr 連接成一個純量變數
$str2 = join "-",@arr;
