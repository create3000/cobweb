
define (function ()
{
"use strict";

	function Geocentric () { }

	Geocentric .prototype =
	{
		constructor: Geocentric,
		convert: function (geocentric, result)
		{
			return result .assign (geocentric);
		},
		apply: function (geocentric, result)
		{
			return result .assign (geocentric);
		},
	};

	return Geocentric;
});
