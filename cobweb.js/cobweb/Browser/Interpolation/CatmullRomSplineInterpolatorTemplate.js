
define ([
	"jquery",
	"cobweb/Browser/Interpolation/CatmullRomSplineInterpolator"
],
function ($,
          CatmullRomSplineInterpolator)
{
"use strict";

	return function (Type)
	{
		var
			c0 = new Type (0, 0, 0, 0),
			c1 = new Type (0, 0, 0, 0),
			c2 = new Type (0, 0, 0, 0),
			c3 = new Type (0, 0, 0, 0);
	
		function CatmullRomSplineInterpolatorInstance ()
		{
			this .T0 = [ ];
			this .T1 = [ ];
		}
	
		CatmullRomSplineInterpolatorInstance .prototype = $.extend (Object .create (CatmullRomSplineInterpolator .prototype),
		{
			constructor: CatmullRomSplineInterpolatorInstance,
			create: function ()
			{
				return new Type (0, 0, 0, 0);
			},
			copy: function (value)
			{
				return value .copy ();
			},
			subtract: function (lhs, rhs)
			{
				return Type .subtract (lhs, rhs);
			},
			multiply: function (lhs, rhs)
			{
				return Type .multiply (lhs, rhs);
			},
			divide: function (lhs, rhs)
			{
				return Type .divide (lhs, rhs);
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
	
		return CatmullRomSplineInterpolatorInstance;
	};
});


