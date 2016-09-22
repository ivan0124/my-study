#!/usr/bin/perl

use strict;
use JSON;
use Net::MQTT::Simple;
#use Net::Address::IP::Local;

my $TIMEOUT = 5;
my $BROKER = "172.22.12.7";
#my $BROKER = "127.0.0.1";

=pod=
JSON: test data
{"result":{"totalsize":2,"item":[{"JoinKey":"JOINADVANTECHIOT","NetID":"2001","Interface":1},{"JoinKey":"JOINADVANTECHIOT","NetID":"2002","Interface":2}]}}
=cut=

sub nr_wsn
{
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
        print "---------------\n";
        print "$WSN_topic{'WSN'}{'Set'}{'JoinKey'}{'Request'}\n";
        print "---------------\n";
      

	my $mqtt =  Net::MQTT::Simple->new($BROKER);
	#my $json_obj = JSON->new;
	my $nr = 0;

    print "exec nr_wsn >\n";
	eval {
		local $SIG{ALRM} = sub {die "timeout.\n"};
		alarm $TIMEOUT;

		$mqtt->subscribe("/WSNMgmt/IoTGW/WSN/+/Response"  => sub {
    	                my ($topic, $message) = @_;
                        print "[Client topic]: $topic\n";
                        print "[Client message]:$message\n";
                        die "Setting_Response ok...\n";
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

                $mqtt->publish("/WSNMgmt/IoTGW/WSN/111/Request","[Client Request]:Perl Mqtt message");
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


