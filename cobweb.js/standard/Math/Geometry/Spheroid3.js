
define (function ()
{
"use strict";

	function Spheroid3 (semiMajorAxis, semiMinorAxis)
	{
		switch (arguments .length)
		{
			case 0:
				this .semiMajorAxis = 0; // a
				this .semiMinorAxis = 0; // c
				break;
			case 2:
				this .semiMajorAxis = semiMajorAxis; // a
				this .semiMinorAxis = semiMinorAxis; // c
				break;
			case 3:
				var f_1 = arguments [1];
				this .semiMajorAxis = semiMajorAxis;                 // a
				this .semiMinorAxis = semiMajorAxis * (1 - 1 / f_1); // c
				break;
		}
	}

	Spheroid3 .prototype =
	{
		constructor: Spheroid3,
		getSemiMajorAxis: function ()
		{
			// Returns the semi-major axis (a)
			return this .semiMajorAxis; // a
		},
		getSemiMinorAxis: function ()
		{
			// Returns the semi-minor axis (c)
			return this .semiMinorAxis; // c
		},
		toString: function ()
		{
			return this .semiMajorAxis + " " + this .semiMinorAxis;
		},
	};

	return Spheroid3;
});
