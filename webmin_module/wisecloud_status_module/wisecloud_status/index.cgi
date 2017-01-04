#!/usr/bin/perl

require './wisecloud-lib.pl';

ui_print_header(undef, $module_info{'desc'}, "", undef, 1, 1);

$cagnet_status_file = "/usr/local/AgentService/agent_status";
$connected_img = "<td><img src=images/conn.png border=0 width=120 height=81 title=\"Connected\"></td>\n";
$disconnected_img = "<td><img src=images/disconn.png border=0 width=120 height=81 title=\"Disconnected\"></td>\n";

print "<center>\n";
print "<a href=http://www.advantech.com/ target=_new><img src=images/logo.png border=0></a><p>\n";
print "<table><tr>\n";
print "<td>";
print "<img src=images/gateway.png border=0";
print " title=\"CAgent is not running!\">";
print "</td>\n";
print $disconnected_img;
print "<td><a target=right href='../wisecloud/index.cgi'>";
print "<img src=images/wise-cloud.gif border=0 title='192.168.1.1'></a></td>\n";
print "</tr></table>\n";

print &ui_hr();

ui_print_footer('/', $text{'index'});
