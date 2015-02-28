
define ([
	"standard/Math/Algorithm",
],
function (Algorithm)
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
		},
		set: function (x, y)
		{
			this .x = x;
			this .y = y;
		},
		equals: function (vector)
		{
			return this .x === vector .x &&
			       this .y === vector .y;
		},
		negate: function ()
		{
			return new Vector2 (-this .x,
			                    -this .y);
		},
		add: function (vector)
		{
			return new Vector2 (this .x + vector .x,
			                    this .y + vector .y);
		},
		subtract: function (vector)
		{
			return new Vector2 (this .x - vector .x,
			                    this .y - vector .y);
		},
		multiply: function (value)
		{
			return new Vector2 (this .x * value,
			                    this .y * value);
		},
		multVec: function (vector)
		{
			return new Vector2 (this .x * vector .x,
			                    this .y * vector .y);
		},
		divide: function (value)
		{
			return new Vector2 (this .x / value,
			                    this .y / value);
		},
		divVec: function (vector)
		{
			return new Vector2 (this .x / vector .x,
			                    this .y / vector .y);
		},
		normalize: function ()
		{
			var length = this .abs ();
			
			if (length)
				return this .divide (length);

			return new Vector2 (0, 0);
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
		lerp: function (vector, t)
		{
			return new Vector2 (Algorithm .lerp (this .x, vector .x, t),
			                    Algorithm .lerp (this .y, vector .y, t));
		},
		min: function (vector)
		{
			var
				x = this .x,
				y = this .y;

			for (var i = 0; i < arguments .length; ++ i)
			{
				var vector = arguments [i];

				x = Math .min (x, vector .x);
				y = Math .min (y, vector .y);
			}

			return new Vector2 (x, y);
		},
		max: function (vector)
		{
			var
				x = this .x,
				y = this .y;

			for (var i = 0; i < arguments .length; ++ i)
			{
				var vector = arguments [i];

				x = Math .max (x, vector .x);
				y = Math .max (y, vector .y);
			}

			return new Vector2 (x, y);
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

	return Vector2;
});
