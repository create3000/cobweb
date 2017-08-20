
all:
#	mv cobweb/Configuration/SupportedNodes.js cobweb/Configuration/SupportedNodes.X3D.js
#	mv cobweb/Configuration/SupportedNodes.VRML.js cobweb/Configuration/SupportedNodes.js
#	jam compile --almond --wrap --no-minify cobweb.js -i cobweb.js -o cobweb.VRML.uncompressed.js
#	uglifyjs -m -c -- cobweb.VRML.uncompressed.js > cobweb.VRML.ugly.js
#	mv cobweb.VRML.ugly.js cobweb.VRML.min.js
#	mv cobweb/Configuration/SupportedNodes.js cobweb/Configuration/SupportedNodes.VRML.js
#	mv cobweb/Configuration/SupportedNodes.X3D.js cobweb/Configuration/SupportedNodes.js

	jam compile --verbose --almond --wrap --no-minify cobweb.js -i cobweb.js -o cobweb.uncompressed.js
	uglifyjs -m -c -- cobweb.uncompressed.js > cobweb.ugly.js
	mv cobweb.ugly.js cobweb.min.js

	perl license.pl

	cp cobweb.html cobweb.min.html
	perl -pi -e 's|\s*<script src="jam/require.js"></script>\n||sg' cobweb.min.html
	perl -pi -e 's|"cobweb.js"|"cobweb.min.js"|sg' cobweb.min.html
	perl -pi -e 's|([">])cobweb.min.html(["<])|\1cobweb.html\2|sg' cobweb.min.html
	perl -pi -e 's|cobweb-dev|cobweb-min|sg' cobweb.min.html

	echo
	ls -la cobweb.min.js
#	ls -la cobweb.VRML.min.js
	echo


dist: all
	perl dist.pl

version:
	perl version.pl


clean:
	rm cobweb.min.html
	rm cobweb.uncompressed.js
	rm cobweb.min.js
