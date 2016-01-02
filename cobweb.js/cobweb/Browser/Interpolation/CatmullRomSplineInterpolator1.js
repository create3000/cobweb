
define ([
	"jquery",
	"cobweb/Browser/Interpolation/CatmullRomSplineInterpolator"
],
function ($,
          CatmullRomSplineInterpolator)
{
"use strict";

	function CatmullRomSplineInterpolator1 ()
	{
		this .T0 = [ ];
		this .T1 = [ ];
	}

	CatmullRomSplineInterpolator1 .prototype = $.extend (Object .create (CatmullRomSplineInterpolator .prototype),
	{
		constructor: CatmullRomSplineInterpolator1,
		create: function ()
		{
			return 0;
		},
		copy: function (value)
		{
			return value;
		},
		subtract: function (lhs, rhs)
		{
			return lhs - rhs;
		},
		multiply: function (lhs, rhs)
		{
			return lhs * rhs;
		},
		divide: function (lhs, rhs)
		{
			return lhs / rhs;
		},
		abs: function (value)
		{
			return Math .abs (value);
		},
		dot: function (SH, C0, C1, C2, C3)
		{
			return C0 * SH [0] + C1 * SH [1] + C2 * SH [2] + C3 * SH [3];
		},
	});

	return CatmullRomSplineInterpolator1;
});


