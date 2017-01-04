# wisecloud-lib.pl
# Common functions for the wise wsn

BEGIN { push(@INC, ".."); };
use WebminCore;
init_config();

sub get_config {
    local $config_file = $_[0];
    local %conf;
    open(FILE, $config{$config_file});
    while(<FILE>) {
    chomp;
    s/#.*//;
    s/^\s+//;
    s/\s+$//;
    s/^\[.*$//;
    next unless length;
    my ($var, $value) = split(/\s*=\s*/, $_, 2);
    $conf{$var} = $value;
    }
    close(FILE);
    return %conf;
}

# Load the XML parser module
eval "use XML::Simple";
if ($@) {
    &error_exit(2, "XML::Simple Perl module is not installed");
    }

# get_agent_config()
# Parse the ML config file
sub get_agent_config
{
my $xml_file = $config{'agentconf_path'};
local $xml = XMLin($xml_file);
if ($@) {
    return $@;
    }
return $xml;
}

# agent_serverip()
# Returns the ip 
sub agent_serverip
{
local $conf = &get_agent_config();
local $serverip = $conf->{BaseSettings}->{ServerIP};
return $serverip;
}

# is_agent_installed()
sub is_agent_installed
{
    if( -r $config{'agentconf_path'} ) {
        return 1;
    } else {
        return 0;
    }
}

# is_support_intel_amt()
sub is_support_intel_amt
{
    return 0;
}

# in_use_pid()
sub in_use_pid()
{
	local $intf = $_[0];
	local $out;
	&open_execute_command(USED, "fuser $intf" , 1, 1);
	while(<USED>) {
		$out .= $_;
	}
	local ($PID) = split(/\s+/, $out);

	close(USED);

	return $PID;

}

sub in_use_task()
{
	local $pid = $_[0];
	local $out;
	&open_execute_command(COMM, "cat /proc/$pid/comm" , 1, 1);
	while(<COMM>) {
		$out .= $_;
	}
	local ($TASK) = split(/\s+/, $out);

	close(COMM);

	return $TASK;

}

# encrypt_amt_password()
sub encrypt_amt_password
{
	local $out;
	local $password = $_[0];
	&open_execute_command(PASSWD, "/usr/local/AgentService/AgentEncrypt $password" , 1, 1);
	while(<PASSWD>) {
		$out .= $_;
	}
	close(PASSWD);

	return $out;
}

# save_agent_config(&config)
sub save_agent_config
{
($serverip, $devicename, $amtid, $amtpwd) = @_;
my $xml_file = $config{'agentconf_path'};
local $xml = XMLin($xml_file, KeepRoot => 1);
$xml->{XMLConfigSettings}->{BaseSettings}->{ServerIP} = $serverip;
$xml->{XMLConfigSettings}->{Profiles}->{DeviceName} = $devicename;
if($amtid && $amtpwd) {
$xml->{XMLConfigSettings}->{Customize}->{AmtID} = $amtid;
$xml->{XMLConfigSettings}->{Customize}->{AmtPwd} = $amtpwd;
}
XMLout($xml, KeepRoot => 1, NoAttr => 1, XMLDecl => '<?xml version="1.0" encoding="UTF-8"?>', OutputFile => $xml_file);
}

1;
