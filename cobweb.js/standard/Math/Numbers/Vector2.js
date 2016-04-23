
define ([
	"jquery",
	"standard/Math/Algorithm",
],
function ($, Algorithm)
{
"use strict";

	function Vector2 (x, y)
	{		
		this .x = x;
		this .y = y;
	}

	Vector2 .prototype =
	{
		constructor: Vector2,
		length: 2,
		copy: function ()
		{
			var copy = Object .create (Vector2 .prototype);
			copy .x = this .x;
			copy .y = this .y;
			return copy;
		},
		assign: function (vector)
		{
			this .x = vector .x;
			this .y = vector .y;
			return this;
		},
		set: function (x, y)
		{
			this .x = x;
			this .y = y;
			return this;
		},
		equals: function (vector)
		{
			return this .x === vector .x &&
			       this .y === vector .y;
		},
		negate: function ()
		{
			this .x = -this .x;
			this .y = -this .y;
			return this;
		},
		add: function (vector)
		{
			this .x += vector .x;
			this .y += vector .y;
			return this;
		},
		subtract: function (vector)
		{
			this .x -= vector .x;
			this .y -= vector .y;
			return this;
		},
		multiply: function (value)
		{
			this .x *= value;
			this .y *= value;
			return this;
		},
		multVec: function (vector)
		{
			this .x *= vector .x;
			this .y *= vector .y;
			return this;
		},
		divide: function (value)
		{
			this .x /= value;
			this .y /= value;
			return this;
		},
		divVec: function (vector)
		{
			this .x /= vector .x;
			this .y /= vector .y;
			return this;
		},
		normalize: function ()
		{
			var length = Math .sqrt (this .x * this .x +
			                         this .y * this .y);
			
			if (length)
			{
				length = 1 / length;

				this .x *= length;
				this .y *= length;
			}

			return this;
		},
		dot: function (vector)
		{
			return this .x * vector .x +
			       this .y * vector .y;
		},
		norm: function ()
		{
			return this .x * this .x +
			       this .y * this .y;
		},
		abs: function ()
		{
			return Math .sqrt (this .x * this .x +
			                   this .y * this .y);
		},
		lerp: function (dest, t)
		{
			this .x = this .x + t * (dest .x - this .x);
			this .y = this .y + t * (dest .y - this .y);
			return this;
		},
		min: function (vector)
		{
			for (var i = 0, length = arguments .length; i < length; ++ i)
			{
				var vector = arguments [i];

				this .x = Math .min (this .x, vector .x);
				this .y = Math .min (this .y, vector .y);
			}

			return this;
		},
		max: function (vector)
		{
			for (var i = 0, length = arguments .length; i < length; ++ i)
			{
				var vector = arguments [i];

				this .x = Math .max (this .x, vector .x);
				this .y = Math .max (this .y, vector .y);
			}

			return this;
		},
		toString: function ()
		{
			return this .x + " " +
			       this .y;
		}
	};

	Object .defineProperty (Vector2 .prototype, "0",
	{
		get: function () { return this .x; },
		set: function (value) { this .x = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Vector2 .prototype, "1",
	{
		get: function () { return this .y; },
		set: function (value) { this .y = value; },
		enumerable: false,
		configurable: false
	});

	$.extend (Vector2,
	{
		Zero: new Vector2 (0, 0),
		One: new Vector2 (1, 1),
		negate: function (vector)
		{
			var copy = Object .create (this .prototype);
			copy .x = -vector .x;
			copy .y = -vector .y;
			return copy;
		},
		add: function (lhs, rhs)
		{
			var copy = Object .create (this .prototype);
			copy .x = lhs .x + rhs .x;
			copy .y = lhs .y + rhs .y;
			return copy;
		},
		subtract: function (lhs, rhs)
		{
			var copy = Object .create (this .prototype);
			copy .x = lhs .x - rhs .x;
			copy .y = lhs .y - rhs .y;
			return copy;
		},
		multiply: function (lhs, rhs)
		{
			var copy = Object .create (this .prototype);
			copy .x = lhs .x * rhs;
			copy .y = lhs .y * rhs;
			return copy;
		},
		multVec: function (lhs, rhs)
		{
			var copy = Object .create (this .prototype);
			copy .x = lhs .x * rhs .x;
			copy .y = lhs .y * rhs .y;
			return copy;
		},
		divide: function (lhs, rhs)
		{
			var copy = Object .create (this .prototype);
			copy .x = lhs .x / rhs;
			copy .y = lhs .y / rhs;
			return copy;
		},
		divVec: function (lhs, rhs)
		{
			var copy = Object .create (this .prototype);
			copy .x = lhs .x / rhs .x;
			copy .y = lhs .y / rhs .y;
			return copy;
		},
		normalize: function (vector)
		{
			var
				copy   = Object .create (this .prototype),
				x      = vector .x,
				y      = vector .y,
				length = Math .sqrt (x * x + y * y);

			if (length)
			{
				length = 1 / length;

				copy .x = x * length;
				copy .y = y * length;
			}
			else
			{
				copy .x = 0;
				copy .y = 0;
			}

			return copy;
		},
		dot: function (lhs, rhs)
		{
			return lhs .dot (rhs);
		},
		lerp: function (source, dest, t)
		{
			return new Vector2 (Algorithm .lerp (source .x, dest .x, t),
			                    Algorithm .lerp (source .y, dest .y, t));
		},
		min: function (lhs, rhs)
		{
			var
				x = lhs .x,
				y = lhs .y;

			for (var i = 1, length = arguments .length; i < length; ++ i)
			{
				var vector = arguments [i];

				x = Math .min (x, vector .x);
				y = Math .min (y, vector .y);
			}

			return new Vector2 (x, y);
		},
		max: function (lhs, rhs)
		{
			var
				x = lhs .x,
				y = lhs .y;

			for (var i = 1, length = arguments .length; i < length; ++ i)
			{
				var vector = arguments [i];

				x = Math .max (x, vector .x);
				y = Math .max (y, vector .y);
			}

			return new Vector2 (x, y);
		},
	});

	return Vector2;
});
