#!/usr/bin/perl

use strict;
use JSON;
use Net::MQTT::Simple;

my $TIMEOUT = 10;
my $BROKER = "172.22.12.70";
#my $BROKER = "localhost";

=pod=
JSON: test data
{"result":{"totalsize":2,"item":[{"JoinKey":"JOINADVANTECHIOT","NetID":"2001","Interface":1},{"JoinKey":"JOINADVANTECHIOT","NetID":"2002","Interface":2}]}}
=cut=

sub nr_wsn
{
	my $mqtt =  Net::MQTT::Simple->new($BROKER);
	#my $json_obj = JSON->new;
	my $nr = 0;

    print "exec nr_wsn >\n";
	eval {
		local $SIG{ALRM} = sub {die "timeout.\n"};
		alarm $TIMEOUT;

		$mqtt->subscribe("/WSNMgmt/IoTGW/WSN/+/Setting"  => sub {
    	                my ($topic, $message) = @_;
                        print "$topic\n";
                        print "$message\n";
		});

		$mqtt->subscribe("/WSNMgmt/IoTGW/WSN/+/Setting2"  => sub {
    	                my ($topic, $message) = @_;
			my @t = split(/\//, $topic);
			my $mac = $t[4];
    	                my $decoded_json = decode_json($message);
                        print "$topic\n";
                        print "$message\n";
                        my $itmes=$decoded_json->{'result'}->{'item'};
                        
                        print "$decoded_json->{'result'}->{'totalsize'}\n";
                        print "$decoded_json->{'result'}->{'item'}\n";
                        print "$decoded_json->{'result'}->{'item'}[0]->{'NetID'}\n";
                        print "$decoded_json->{'result'}->{'item'}[1]->{'NetID'}\n";
                        for my $item ( @$itmes ) {
                            my $NetID     = $item->{NetID};
                            print "NetID=$NetID\n"
                        }
                        
		});

                $mqtt->publish("/WSNMgmt/IoTGW/WSN/111/Setting","Perl Mqtt message~~~~");
		$mqtt->run();

		alarm(0);
	};

	if ($@) {
		print $@;
		return $nr;
	}
}


my $nr = nr_wsn();
print "Total manager: $nr\n";


