
define ([
	"jquery",
	"cobweb/Browser/Interpolation/CatmullRomSplineInterpolator",
	"standard/Math/Numbers/Vector3",
],
function ($,
          CatmullRomSplineInterpolator,
          Vector3)
{
"use strict";

	var
		c0 = new Vector3 (0, 0, 0),
		c1 = new Vector3 (0, 0, 0),
		c2 = new Vector3 (0, 0, 0),
		c3 = new Vector3 (0, 0, 0);

	function CatmullRomSplineInterpolator3 ()
	{
		this .T0 = [ ];
		this .T1 = [ ];
	}

	CatmullRomSplineInterpolator3 .prototype = $.extend (Object .create (CatmullRomSplineInterpolator .prototype),
	{
		constructor: CatmullRomSplineInterpolator3,
		create: function ()
		{
			return new Vector3 (0, 0, 0);
		},
		copy: function (value)
		{
			return value .copy ();
		},
		subtract: function (lhs, rhs)
		{
			return Vector3 .subtract (lhs, rhs);
		},
		multiply: function (lhs, rhs)
		{
			return Vector3 .multiply (lhs, rhs);
		},
		divide: function (lhs, rhs)
		{
			return Vector3 .divide (lhs, rhs);
		},
		abs: function (value)
		{
			return value .abs ();
		},
		dot: function (SH, C0, C1, C2, C3)
		{
			c0 .assign (C0) .multiply (SH [0]);
			c1 .assign (C1) .multiply (SH [1]);
			c2 .assign (C2) .multiply (SH [2]);
			c3 .assign (C3) .multiply (SH [3]);

			return c0 .add (c1) .add (c2) .add (c3);
		},
	});

	return CatmullRomSplineInterpolator3;
});


