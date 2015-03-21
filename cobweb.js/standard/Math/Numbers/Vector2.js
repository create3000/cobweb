
define ([
	"jquery",
	"standard/Math/Algorithm",
],
function ($, Algorithm)
{
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
			copy .assign (this);
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
		min: function (vector)
		{
			for (var i = 0; i < arguments .length; ++ i)
			{
				var vector = arguments [i];

				this .x = Math .min (this .x, vector .x);
				this .y = Math .min (this .y, vector .y);
			}

			return this;
		},
		max: function (vector)
		{
			for (var i = 0; i < arguments .length; ++ i)
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
