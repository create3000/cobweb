
all:
	mv cobweb/Configuration/SupportedNodes.js cobweb/Configuration/SupportedNodes.X3D.js
	mv cobweb/Configuration/SupportedNodes.VRML.js cobweb/Configuration/SupportedNodes.js
	jam compile --wrap --no-minify cobweb.js -i cobweb.js -o cobweb.VRML.full.js
	uglifyjs -m -c -- cobweb.VRML.full.js > cobweb.VRML.ugly.js
	mv cobweb.VRML.ugly.js cobweb.VRML.min.js
	mv cobweb/Configuration/SupportedNodes.js cobweb/Configuration/SupportedNodes.VRML.js
	mv cobweb/Configuration/SupportedNodes.X3D.js cobweb/Configuration/SupportedNodes.js

	jam compile --wrap --no-minify cobweb.js -i cobweb.js -o cobweb.full.js
	uglifyjs -m -c -- cobweb.full.js > cobweb.ugly.js
	mv cobweb.ugly.js cobweb.min.js

	cp cobweb.html cobweb.min.html
	perl -pi -e 's|\s*<script src="jam/require.js"></script>\n||sg' cobweb.min.html
	perl -pi -e 's|cobweb.js|cobweb.min.js|sg' cobweb.min.html
	perl -pi -e 's|cobweb.min.html|cobweb.html|sg' cobweb.min.html

	echo
	ls -la cobweb.min.js
	ls -la cobweb.VRML.min.js
	echo

version: all
	perl version.pl

clean:
	rm cobweb.min.html
	rm cobweb.full.js
	rm cobweb.min.js
