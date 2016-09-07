#!/usr/bin/perl

# 純量 (scalar)

# (1) 純量：以 $ 開頭之變數，可儲存整數、浮點數、字串等

$val1 = 1;          # 1
$val2 = 0x123;          # 十六進位數值 123

# 為了使數字方便辨識，可加入 _ 分隔，
# 此變數數值為 23323930
$val3 = 23_323_930;

$val4 = -4.32e3;        # 科學記號
$str1 = "AB";           # 字串 "AB"
$name = "Bill";
print "Hello, $name\n";     # 雙引號可內嵌變數
print 'Hello, $name\n';     # 單引號不行

# (2) 數值與字串間的自動轉換

$a = "1";           # 字串
$b = "2";           # 字串

# Perl 會先將 $a 與 $b 自動轉為數值再相加，傳回數值
$c = $a + $b;

$d = "12abc34";

# Perl 會略過 $d 內非數字起頭到結尾的部份，
# 即 $d 被轉換為數值 12，再經計算 $e 為 24
$e = $d * 2;
$f = "abc";

# 若完全不是數字的字串，會被轉換成零，
# 因此結果 $f 被轉換為零，再經計算 $g 亦為 0
$g = $f * 2;

$a = 1;     # 數值

# Perl 會將 $a 轉為字串，做字串相加，$b 為 "string1"
$b = "string" . $a;
# 註：'.' 為字串相加運算子 

# (3) 在字串內安插變數

$val = 12;
$str1 = "I have $val dollars.";     # 安插變數
$str2 = 'I have ' . $val . ' dollars.'; # 字串相加

$str3 = "def";

# Perl 有時容易誤判變數名稱
$str4 = "abc$str3ghijk";

# 加入 {} 之後，可讓 Perl 正確判斷安插變數名稱
$str5 = "abc${str3}ghijk";

# (4) 特殊變數 $_

$_ = "Bill";
print;  # 若省略參數，預設為 $_，即 print $_;

# (5) chomp,chop 刪除最後一個(換行)字元

$str1 = "hello world.\n";

chomp($str1);   # 刪除最後一個換行字元，變成 "hello world."

chomp($str1);   # 無效果

chop($str1);    # 刪除最後一個字元，變成 "hello world"

chop($str1);    # 刪除最後一個字元，變成 "hello worl"
