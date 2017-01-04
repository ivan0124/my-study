
do 'wisecloud-lib.pl';

=head2 is_installed(mode)

For mode 1, returns 2 if WISE is installed and configured for use by
Webmin, 1 if installed but not configured, or 0 otherwise.
For mode 0, returns 1 if installed, 0 if not

=cut
sub is_installed
{
my ($mode) = @_;

# This is the code that you'd want if the WISE webserver really existed
#if (-r $config{'wise_conf'}) {
#	return $mode + 1;
#	}
#return 0;

return $mode + 1;
}

