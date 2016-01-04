
define ([
	"jquery",
	"standard/Math/Numbers/Color3",
	"standard/Math/Algorithm",
],
function ($, Color3, Algorithm)
{
"use strict";

	var clamp = Algorithm .clamp;

	function Color4 (r, g, b, a)
	{
		if (arguments .length)
		{
			this .r_ = clamp (r, 0, 1);
			this .g_ = clamp (g, 0, 1);
			this .b_ = clamp (b, 0, 1);
			this .a_ = clamp (a, 0, 1);
		}
		else
		{
			this .r_ = 0;
			this .g_ = 0;
			this .b_ = 0;
			this .a_ = 0;
		}
	}

	Color4 .prototype =
	{
		constructor: Color4,
		length: 4,
		copy: function ()
		{
			var copy = Object .create (Color4 .prototype);
			copy .r_ = this .r_;
			copy .g_ = this .g_;
			copy .b_ = this .b_;
			copy .a_ = this .a_;
			return copy;
		},
		assign: function (color)
		{
			this .r_ = color .r_;
			this .g_ = color .g_;
			this .b_ = color .b_;
			this .a_ = color .a_;
		},
		set: function (r, g, b, a)
		{
			this .r_ = clamp (r, 0, 1);
			this .g_ = clamp (g, 0, 1);
			this .b_ = clamp (b, 0, 1);
			this .a_ = clamp (a, 0, 1);
		},
		equals: function (color)
		{
			return this .r_ === color .r_ &&
			       this .g_ === color .g_ &&
			       this .b_ === color .b_ &&
			       this .a_ === color .a_;
		},
		getHSV: Color3 .getHSV,
		setHSV: Color3 .setHSV,
		toString: function ()
		{
			return this .r_ + " " +
			       this .g_ + " " +
			       this .b_ + " " +
			       this .a_;
		},
	};

	var r = {
		get: function () { return this .r_; },
		set: function (value) { this .r_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	};
	
	var g = {
		get: function () { return this .g_; },
		set: function (value) { this .g_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	};

	var b = {
		get: function () { return this .b_; },
		set: function (value) { this .b_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	};

	var a = {
		get: function () { return this .a_; },
		set: function (value) { this .a_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	};

	Object .defineProperty (Color4 .prototype, "r", r);
	Object .defineProperty (Color4 .prototype, "g", g);
	Object .defineProperty (Color4 .prototype, "b", b);
	Object .defineProperty (Color4 .prototype, "a", a);

	r .enumerable = false;
	g .enumerable = false;
	b .enumerable = false;
	a .enumerable = false;

	Object .defineProperty (Color4 .prototype, "0", r);
	Object .defineProperty (Color4 .prototype, "1", g);
	Object .defineProperty (Color4 .prototype, "2", b);
	Object .defineProperty (Color4 .prototype, "3", a);

	Color4 .HSVA = function (h, s, v, a)
	{
		var color = new Color4 (0, 0, 0, a);
		color .setHSV (h, s, v);
		return color;
	}

	return Color4;
});
