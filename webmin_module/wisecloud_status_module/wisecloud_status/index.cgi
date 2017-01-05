#!/usr/bin/perl

require './wisecloud-lib.pl';
&foreign_require("wisecloud", "wisecloud-lib.pl");

ui_print_header(undef, $module_info{'desc'}, "", undef, 1, 1);

$cagnet_status_file = "/usr/local/AgentService/agent_status";
$connected_img = "<td><img src=images/conn.png border=0 width=120 height=81 title=\"Connected\"></td>\n";
$disconnected_img = "<td><img src=images/disconn.png border=0 width=120 height=81 title=\"Disconnected\"></td>\n";

sub check_cagent_active
{
	$output = `ps ax|grep -v grep|grep cagent`;
	if($output) {
		return 1;
	} else {
		return 0;
	}
}
$is_cagent_active = &check_cagent_active();

sub check_cagent_cloud_conn
{
	local $stat = `cat $cagnet_status_file`;
    $stat = substr($stat,0,1);
	local $output = `netstat -an|grep :1883`;
	local @arr = split(' ', $output);
	if($stat eq '1' && $is_cagent_active) {
		return 1;
	} else {
		return 0;
	}
}
$is_cagent_cloud_conn = &check_cagent_cloud_conn();
%wiseconf = &wisecloud::get_config('wise_conf');

print "<center>\n";
print "<a href=http://www.advantech.com/ target=_new><img src=images/logo.png border=0></a><p>\n";
print "<table><tr>\n";
print "<td>";
print "<img src=images/gateway.png border=0";
if($is_cagent_active) {
	print " title=\"CAgent is running!\">";
} else {
	print " title=\"CAgent is not running!\">";
}
print "</td>\n";
if($is_cagent_cloud_conn) {
	print $connected_img;
} else {
	print $disconnected_img;
}
print "<td><a target=right href='../wisecloud/index.cgi'>";
print "<img src=images/wise-cloud.gif border=0 title=$wiseconf{'ServerIP'}></a></td>\n";
print "</tr></table>\n";

print &ui_hr();

ui_print_footer('/', $text{'index'});
