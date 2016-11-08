#!/usr/bin/perl

require LWP::UserAgent;
 
  my $ua = LWP::UserAgent->new;
  $ua->timeout(10);

  # Create a request
  my $req = HTTP::Request->new(PUT => 'http://172.22.213.174:3000/restapi/wsnmanage/SenHub/0017000E4C000000/SenHub/Info/Name');
  $req->content_type('application/json');
  #$req->authorization_basic("admin", "secret");
  $req->content('{"sv":"web_123457890"}');

  # Pass request to the user agent and get a response back
  my $res = $ua->request($req);

  # Check the outcome of the response
  if ($res->is_success) {
      print $res->content;
  } else {
      print $res->status_line, "n";
  }
