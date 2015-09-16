
all:
	jam compile --wrap --no-minify cobweb.js -i cobweb.js -o cobweb.min.js
	uglifyjs -m -- cobweb.min.js > cobweb.ugly.js
	mv cobweb.ugly.js cobweb.min.js

clean:
	rm cobweb.min.js
