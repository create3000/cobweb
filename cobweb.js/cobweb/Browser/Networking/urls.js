
define ([
	"jquery",
	"cobweb/Browser/VERSION",
	"standard/Networking/URI",
	"lib/sprintf.js/src/sprintf",
],
function ($,
          VERSION,
          URI,
          sprintf)
{
"use strict";

	var
		MAJOR            = parseInt (VERSION),
		cobwebExpression = /\/(?:cobweb\.min\.js|cobweb\.uncompressed\.js|cobweb\.js)$/,
		script           = $("script") .filter (function (i, element) { return element .src .match (cobwebExpression); }),
		scriptURL        = new URI (script [0] .src);

	function componentUrl (name)
	{
		if (VERSION === String (parseFloat (VERSION)))
		{
			return [
				scriptURL .transform (new URI (sprintf .sprintf ("components/%s.js", name))) .toString (),
				sprintf .sprintf ("https://cdn.rawgit.com/create3000/cobweb/master/stable/%s/%s/Components/%s.js", MAJOR, VERSION, name),
				sprintf .sprintf ("http://cdn.rawgit.com/create3000/cobweb/master/stable/%s/%s/Components/%s.js",  MAJOR, VERSION, name),
				sprintf .sprintf ("https://rawgit.com/create3000/cobweb/master/stable/%s/%s/Components/%s.js",     MAJOR, VERSION, name),
				sprintf .sprintf ("http://rawgit.com/create3000/cobweb/master/stable/%s/%s/Components/%s.js",      MAJOR, VERSION, name),
			];
		}
		else
		{
			return [
				scriptURL .transform (new URI (sprintf .sprintf ("components/%s.js", name))) .toString (),
				sprintf .sprintf ("https://cdn.rawgit.com/create3000/cobweb/master/cobweb.js/components/%s.js", name),
				sprintf .sprintf ("http://cdn.rawgit.com/create3000/cobweb/master/cobweb.js/components/%s.js", name),
				sprintf .sprintf ("https://rawgit.com/create3000/cobweb/master/cobweb.js/components/%s.js",     name),
				sprintf .sprintf ("http://rawgit.com/create3000/cobweb/master/cobweb.js/components/%s.js",      name),
			];
		}
	}

	return {
		providerUrl:       "http://titania.create3000.de/cobweb",
		componentUrl:       componentUrl,
		fallbackUrl:       "https://crossorigin.me/",
		fallbackExpression: new RegExp ("^https://crossorigin.me/"),
	};
});
