
define ([
	"jquery",
	"standard/Math/Algorithm",
],
function ($, Algorithm)
{
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
	
	$.extend (Color4,
	{
		HSVA: function (h, s, v, a)
		{
			var color = new Color3 (0, 0, 0, a);
			color .setHSV (h, s, v);
			return color;
		},
	});

	Color4 .prototype =
	{
		constructor: Color4,
		length: 4,
		copy: function ()
		{
			var copy = Object .create (Color4 .prototype);
			copy .assign (this);
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
		getHSV: function ()
		{
			var h, s, v;

			var min = Math .min (this .r_, this .g_, this .b_);
			var max = Math .max (this .r_, this .g_, this .b_);
			v = max; // value

			var delta = max - min;

			if (max !== 0 && delta !== 0)
			{
				s = delta / max; // s

				if (this .r === max)
					h =     (this .g_ - this .b_) / delta;  // between yellow & magenta
				else if (this .g_ == max)
					h = 2 + (this .b_ - this .r_) / delta;  // between cyan & yellow
				else
					h = 4 + (this .r_ - this .g_) / delta;  // between magenta & cyan

				h *= Math .PI / 3;  // radiants
				if (h < 0)
					h += Math .PI * 2;
			}
			else
				s = h = 0;         // s = 0, h is undefined

			return [h, s, v];
		},
		setHSV: function (h, s, v)
		{
			s = clamp (s, 0, 1),
			v = clamp (v, 0, 1);

			// H is given on [0, 2 * Pi]. S and V are given on [0, 1].
			// RGB are each returned on [0, 1].

			if (s === 0)
			{
				// achromatic (grey)
				this .r_ = this .g_ = this .b_ = v;
			}
			else
			{
				var w = Algorithm .degrees (Algorithm .interval (h, 0, Math .PI * 2)) / 60;     // sector 0 to 5

				var i = Math .floor (w);
				var f = w - i;                      // factorial part of h
				var p = v * (1 - s);
				var q = v * (1 - s * f);
				var t = v * (1 - s * (1 - f));

				switch (i % 6)
				{
					case 0:  this .r_ = v; this .g_ = t; this .b_ = p; break;
					case 1:  this .r_ = q; this .g_ = v; this .b_ = p; break;
					case 2:  this .r_ = p; this .g_ = v; this .b_ = t; break;
					case 3:  this .r_ = p; this .g_ = q; this .b_ = v; break;
					case 4:  this .r_ = t; this .g_ = p; this .b_ = v; break;
					default: this .r_ = v; this .g_ = p; this .b_ = q; break;
				}
			}
		},
		toString: function ()
		{
			return this .r_ + " " +
			       this .g_ + " " +
			       this .b_ + " " +
			       this .a_;
		},
	};

	Object .defineProperty (Color4 .prototype, "r",
	{
		get: function () { return this .r_; },
		set: function (value) { this .r_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "0",
	{
		get: function () { return this .r_; },
		set: function (value) { this .r_ = clamp (value, 0, 1); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "g",
	{
		get: function () { return this .g_; },
		set: function (value) { this .g_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "1",
	{
		get: function () { return this .g_; },
		set: function (value) { this .g_ = clamp (value, 0, 1); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "b",
	{
		get: function () { return this .b_; },
		set: function (value) { this .b_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "2",
	{
		get: function () { return this .b_; },
		set: function (value) { this .b_ = clamp (value, 0, 1); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "a",
	{
		get: function () { return this .a_; },
		set: function (value) { this .a_ = clamp (value, 0, 1); },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Color4 .prototype, "3",
	{
		get: function () { return this .a_; },
		set: function (value) { this .a_ = clamp (value, 0, 1); },
		enumerable: false,
		configurable: false
	});

	Color4 .HSVA = function (h, s, v, a)
	{
		var color = new Color4 (0, 0, 0, a);
		color .setHSV (h, s, v);
		return color;
	}

	return Color4;
});
