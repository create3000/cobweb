
define (function ()
{
"use strict";
	
	return {
		provider:   "http://titania.create3000.de/cobweb",
		fallback:   "https://crossorigin.me/",
		fallbackRx: new RegExp ("^https://crossorigin.me/")
	};
});
