
define ([
	"cobweb/Browser/VERSION",
],
function (VERSION)
{
"use strict";

	return VERSION .match (/^\d+\.\d+a$/);
});
