
define ([
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function (Vector3,
          Algorithm)
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
		slerp: function (source, destination, t)
		{
			var
				sourceLength      = source      .abs (),
				destinationLength = destination .abs ();
			
			source      .normalize ();
			destination .normalize ();
			
			return Algorithm .simpleSlerp (source, destination, t) .multiply (Algorithm .lerp (sourceLength, destinationLength, t));
		},
	};

	return Geocentric;
});
