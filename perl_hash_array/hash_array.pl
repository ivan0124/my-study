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

#
my %WSN_topic;
#
$WSN_topic{"WSN"}{"Set"}{"NetID"}{"Request"} = "/WSNMgmt/IoTGW/WSN/SetNetID_Request/";
$WSN_topic{"WSN"}{"Set"}{"NetID"}{"Response"} = "/WSNMgmt/IoTGW/WSN/SetNetID_Response/";
$WSN_topic{"WSN"}{"Get"}{"NetID"}{"Request"} = "/WSNMgmt/IoTGW/WSN/GetNetID_Request/";
$WSN_topic{"WSN"}{"Get"}{"NetID"}{"Response"} = "/WSNMgmt/IoTGW/WSN/GetNetID_Response/";
#
$WSN_topic{"WSN"}{"Set"}{"JoinKey"}{"Request"} = "/WSNMgmt/IoTGW/WSN/SetJoinKey_Request/";
$WSN_topic{"WSN"}{"Set"}{"JoinKey"}{"Response"} = "/WSNMgmt/IoTGW/WSN/SetJoinKey_Response/";
$WSN_topic{"WSN"}{"Get"}{"JoinKey"}{"Request"} = "/WSNMgmt/IoTGW/WSN/GetJoinKey_Request/";
$WSN_topic{"WSN"}{"Get"}{"JoinKey"}{"Response"} = "/WSNMgmt/IoTGW/WSN/GetJoinKey_Response/";
#
my $action="Get";
print "---------------\n";
print "$WSN_topic{'WSN'}{$action}{'JoinKey'}{'Request'}\n";
print "---------------\n";
