#!/usr/bin/perl

=pod
comment here:
=cut


$timeout=3;
eval{
    local $SIG{ALRM} = sub { die "timeout occur:$timeout second, run alarm\n"; };
    alarm $timeout; #設定3秒後進入超時處理, function 定義在 $SIG{ALRM}
    sleep 20;
    print "in alarm eval\n";
    alarm(0); #取消超時處理 
};
print "out of alarm eval\n";

#處理超時function中的打印會放在 $@中
if($@){
    if($@ =~ /die in sig alarm/){
        print "caught the error\n";
    }
    else{
        print $@;
    }
}
