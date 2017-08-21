#!/usr/bin/perl
# -*- Mode: Perl; coding: utf-8; tab-width: 3; indent-tabs-mode: t; c-basic-offset: 3 -*-

use strict;
use warnings;
use v5.10.0;
use open qw/:std :utf8/;

my $license      = join "", `cat 'license.txt'`;
my $min          = join "", `cat 'cobweb.min.js'`;
my $uncompressed = join "", `cat 'cobweb.uncompressed.js'`;

open MIN, ">", "cobweb.min.js";
print MIN $license, $min;
close MIN;

open UNCOMPRESSED, ">", "cobweb.uncompressed.js";
print UNCOMPRESSED $license, $uncompressed;
close UNCOMPRESSED;
