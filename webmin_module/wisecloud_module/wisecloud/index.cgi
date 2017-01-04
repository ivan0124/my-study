#!/usr/bin/perl

require './wisecloud-lib.pl';

ui_print_header(undef, $module_info{'desc'}, "", undef, 1, 1);

%wiseconf = &get_config('wise_conf');

print &ui_hr();
# Build table contents
if(&is_agent_installed()) {
print "<form action=\"savewise.cgi\">\n";
print "<table border width=100%>\n";
print "<tr> <td><table>\n";
print "<tr $tb> <td colspan=4><b>$text{'cloudserver'}</b></td> </tr>\n";

print "<tr> <td width=80><b>IP Address</b></td>\n";
print "<td><input name=serverip size=40 value=\"$wiseconf{'ServerIP'}\"> </td></tr>\n";
print "<tr> <td width=80><b>Device Name</b></td>\n";
if($wiseconf{'DeviceName'}) {
print "<td><input name=devicename size=40 value=\"$wiseconf{'DeviceName'}\"> </td></tr>\n";
} else {
print "<td><input name=devicename size=40 value=\"".&get_system_hostname()."\"> </td></tr>\n";
}
print "</table></td></tr></table>\n";

if(&is_support_intel_amt()) {
print &ui_hr();
print "<table border width=100%>\n";
print "<tr> <td><table>\n";
print "<tr $tb> <td colspan=4><b>Intel AMT Setting</b></td> </tr>\n";

print "<tr> <td width=80><b>ID</b></td>\n";
print "<td><input name=amtid size=40 value=\"$wiseconf{'AmtId'}\"> </td></tr>\n";
print "<tr> <td><b>Password</b></td>\n";
print "<td><input name=amtpwd size=40 value=\"$wiseconf{'AmtPwd'}\"> </td></tr>\n";
print "</table></td></tr></table>\n";
}

print "<input type=submit value=\"$text{'savewise'}\" name=savewisecloud></form>\n";
print &ui_hr();
} else {
print "<form>\n";
print "<table border width=100%>\n";
print "<tr> <td><table>\n";
print "<tr $tb> <td colspan=4><b>$text{'cloudserver'}</b></td> </tr>\n";
print "<tr> <td colspan=4 width=420>WISE Agent was not installed.</td>\n";
print "</table></td></tr></table>\n";
print "</form>\n";
print &ui_hr();
}

ui_print_footer('/', $text{'index'});
