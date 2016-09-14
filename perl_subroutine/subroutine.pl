#!/usr/bin/perl

=head1
Sample1: function input parameters.
=cut

sub testFn{
    local $a=55;
    print "testFn is called. all param=@_\n";
    print "testFn is called. input param 0=$_[0]\n";
    print "testFn is called. input param 1=$_[1]\n";
}


&testFn(10,11);

=head2
Sample2: function return value.
=cut

sub contextualSubroutine {
	# 调用这里需要一个列表，那么就返回一个列表
	return ("Everest", "K2", "Etna") if wantarray;

	# 调用者需要一个scalar，那么就返回一个scalar
	return 3;
}

my @array = &contextualSubroutine();
print "array=@array\n"; # "EverestK2Etna"

my $scalar = &contextualSubroutine();
print "scalar=$scalar\n"; # "3"


=head1
Sample3: function parameters can be changed.
=cut

sub reassign{
    $_[0]=89;
}

my $test_val=20;
reassign($test_val);

print "test_val=$test_val\n";
