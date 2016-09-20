#!/usr/bin/perl

require LWP::UserAgent;
 
 my $ua = LWP::UserAgent->new;
 $ua->default_header('Content-Type' => 'application/json');
 $ua->timeout(10);
 $ua->env_proxy;
 my $response = $ua->get('http://admin:admin@172.22.12.70/restapi/AccountMgmt');
 
 if ($response->is_success) {
     print $response->decoded_content;  # or whatever
 }
 else {
     die $response->status_line;
 }
