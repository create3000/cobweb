#!/usr/bin/perl
# -*- Mode: Perl; coding: utf-8; tab-width: 3; indent-tabs-mode: t; c-basic-offset: 3 -*-

use strict;
use warnings;
use v5.10.0;
use open qw/:std :utf8/;

say `pwd`;

my $VERSION = `cat cobweb/Browser/VERSION.js`;
$VERSION =~ /"(.*?)"/;
$VERSION = $1;

my $MAJOR       = int ($VERSION);
my $VERSION_DIR = "../stable/$MAJOR/$VERSION";
my $LATEST      = "../stable/latest";

sub cp {
	my $VERSION_DIR = shift;

	system "cp", "-v", "cobweb.css",                   $VERSION_DIR;
	system "cp", "-v", "spinner.css",                  $VERSION_DIR;
	system "cp", "-v", "cobweb.uncompressed.js",      "$VERSION_DIR/cobweb.js";
	system "cp", "-v", "cobweb.min.js",                $VERSION_DIR;
	system "cp", "-v", "cobweb.VRML.uncompressed.js", "$VERSION_DIR/cobweb.VRML.js";
	system "cp", "-v", "cobweb.VRML.min.js",           $VERSION_DIR;
	system "cp", "-v", "-r", "images",                 $VERSION_DIR;
	system "cp", "-v", "browser.html",                 $VERSION_DIR;

	system "perl", "-pi", "-e", 's|\s*<script src="jam/require\.js"></script>\n||sg', "$VERSION_DIR/browser.html";
}

exit unless -d $VERSION_DIR;

say "Making version '$VERSION' now.";

cp $VERSION_DIR;
cp $LATEST;
