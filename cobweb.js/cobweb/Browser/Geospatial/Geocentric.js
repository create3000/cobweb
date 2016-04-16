
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
		lerp: function (source, destination, t)
		{
			this .source      .assign (s);
			this .destination .assign (d);

			var
				sourceLength      = source      .abs ();
				destinationLength = destination .abs ();
			
			source      .normalize ();
			destination .normalize ();
			
			return source .slerp (destination, t) * Algorithm .lerp (sourceLength, destinationLength, t);
		},
		source: new Vector3 (0, 0, 0),
		destination: new Vector3 (0, 0, 0),
	};

	return Geocentric;
});
