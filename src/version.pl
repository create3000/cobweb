#!/usr/bin/perl
# -*- Mode: Perl; coding: utf-8; tab-width: 3; indent-tabs-mode: t; c-basic-offset: 3 -*-

use strict;
use warnings;
use v5.10.0;
use open qw/:std :utf8/;

my $CWD = `pwd`;
chomp $CWD;

say $CWD;

my $VERSION = `cat cobweb/Browser/VERSION.js`;
$VERSION =~ /"(.*?)"/;
$VERSION = $1;

sub commit {
	my $version = shift;

	chdir "../";

	system "git", "commit", "-am",  "Publised version $VERSION.";
	system "git", "push", "origin";
	system "git", "push", "github";

	chdir $CWD;
}

sub publish {
	my $version = shift;

	chdir "../";

	system "git", "tag", "--delete", "$version";
	system "git", "push", "--delete", "origin", "$version";
	system "git", "push", "--delete", "github", "$version";

	system "git", "tag", "$version";
	system "git", "push", "origin", "--tags";
	system "git", "push", "github", "--tags";

	chdir $CWD;
}

exit if $VERSION =~ /a$/;

my $result = system "zenity", "--question", "--text=Do you really want to publish the project as version $VERSION?", "--ok-label=Yes", "--cancel-label=No";

if ($result == 0)
{
	say "Publishing version '$VERSION' now.";

	commit;
	publish ($VERSION);
	publish ("latest");
}
