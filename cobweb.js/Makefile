
all:
	jam compile --wrap --no-minify cobweb.js -i cobweb.js -o cobweb.full.js
	uglifyjs -m -c -- cobweb.full.js > cobweb.ugly.js
	mv cobweb.ugly.js cobweb.min.js

	cp cobweb.html cobweb.min.html
	perl -pi -e 's|\s*<script src="jam/require.js"></script>\n||sg' cobweb.min.html
	perl -pi -e 's|cobweb.js|cobweb.min.js|sg' cobweb.min.html
	perl -pi -e 's|cobweb.min.html|cobweb.html|sg' cobweb.min.html

	echo
	ls -la cobweb.min.js
	echo

version: all
	perl version.pl

clean:
	rm cobweb.min.html
	rm cobweb.full.js
	rm cobweb.min.js
