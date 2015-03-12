
define ([
	"jquery",
	"standard/Math/Algorithm",
],
function ($, Algorithm)
{
	function Vector2 (x, y)
	{		
		if (arguments .length)
		{
			this .x = x;
			this .y = y;
		}
		else
		{
			this .x = 0;
			this .y = 0;
		}
	}

	Vector2 .prototype =
	{
		constructor: Vector2,
		length: 2,
		copy: function ()
		{
			return new Vector2 (this .x,
			                    this .y);
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
			var length = this .abs ();
			
			if (length)
				return this .divide (length);

			return this .set (0, 0, 0);
		},
		dot: function (vector)
		{
			return this .x * vector .x +
			       this .y * vector .y;
		},
		norm: function ()
		{
			return this .dot (this);
		},
		abs: function ()
		{
			return Math .sqrt (this .norm ());
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
		Zero: new Vector2 (),
		One: new Vector2 (1, 1),
		negate: function ()
		{
			return vector .copy () .negate ();
		},
		add: function (lhs, rhs)
		{
			return lhs .copy () .add (rhs);
		},
		subtract: function (lhs, rhs)
		{
			return lhs .copy () .subtract (rhs);
		},
		multiply: function (lhs, rhs)
		{
			return lhs .copy () .multiply (rhs);
		},
		multVec: function (lhs, rhs)
		{
			return lhs .copy () .multVec (rhs);
		},
		divide: function (lhs, rhs)
		{
			return lhs .copy () .divide (rhs);
		},
		divVec: function (lhs, rhs)
		{
			return lhs .copy () .divVec (rhs);
		},
		normalize: function ()
		{
			return vector .copy () .normalize ();
		},
		lerp: function (source, dest, t)
		{
			return new Vector2 (Algorithm .lerp (source .x, dest .x, t),
			                    Algorithm .lerp (source .y, dest .y, t));
		},
		min: function (lhs, rhs)
		{
			var
				x = arguments [0] .x,
				y = arguments [0] .y;

			for (var i = 1; i < arguments .length; ++ i)
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
				x = arguments [0] .x,
				y = arguments [0] .y;

			for (var i = 1; i < arguments .length; ++ i)
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
