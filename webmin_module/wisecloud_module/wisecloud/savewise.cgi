#!/usr/bin/perl

require './wisecloud-lib.pl';
ReadParse();

&ui_print_header(undef, $text{'index_title'}, "");
print "<p>\n";

if ($in{'savewisecloud'}) {

error_setup($text{'save_err'});
lock_file($config{'wise_conf'});
open(FILE, "> $config{'wise_conf'}");
print FILE "[Cloudserver]\n";
print FILE "ServerIP = $in{'serverip'}\n";
print FILE "DeviceName = $in{'devicename'}\n";
print FILE "[IntelAMT]\n";
print FILE "AmtId = $in{'amtid'}\n";
print FILE "AmtPwd = $in{'amtpwd'}\n";
close(FILE);
unlock_file($config{'wise_conf'});

# Save to agent config file
#local $encpass = encrypt_amt_password($in{'amtpwd'});
save_agent_config($in{'serverip'}, $in{'devicename'}, $in{'amtid'}, encrypt_amt_password($in{'amtpwd'}));

# Restart 
local $temp = "/tmp/saveagent.log";
local $rv = &system_logged("/etc/init.d/saagent restart >$temp 2>&1");
local $out = `cat $temp`;
unlink($temp);
if ($rv) { &error("$out"); }
else {
    print "<pre> Save & Restart Agent...Done</pre>\n";
}

}
&ui_print_footer("", $text{'index_title'});
