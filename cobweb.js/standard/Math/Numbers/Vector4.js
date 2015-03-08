
define ([
	"jquery",
	"standard/Math/Algorithm",
],
function ($, Algorithm)
{
	function Vector4 (x, y, z, w)
	{		
		if (arguments .length)
		{
			this .x = x;
			this .y = y;
			this .z = z;
			this .w = w;
		}
		else
		{
			this .x = 0;
			this .y = 0;
			this .z = 0;
			this .w = 0;
		}
	}

	$.extend (Vector4,
	{
		Zero: new Vector4 (),
		One: new Vector4 (1, 1, 1, 1),
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
			return new Vector4 (Algorithm .lerp (source .x, dest .x, t),
			                    Algorithm .lerp (source .y, dest .y, t),
			                    Algorithm .lerp (source .z, dest .z, t),
			                    Algorithm .lerp (source .w, dest .w, t));
		},
		min: function (lhs, rhs)
		{
			var
				x = arguments [0] .x,
				y = arguments [0] .y,
				z = arguments [0] .z,
				w = arguments [0] .w;

			for (var i = 1; i < arguments .length; ++ i)
			{
				var vector = arguments [i];

				x = Math .min (x, vector .x);
				y = Math .min (y, vector .y);
				z = Math .min (z, vector .z);
				w = Math .min (w, vector .w);
			}

			return new Vector4 (x, y, z, w);
		},
		max: function (lhs, rhs)
		{
			var
				x = arguments [0] .x,
				y = arguments [0] .y,
				z = arguments [0] .z,
				w = arguments [0] .w;

			for (var i = 1; i < arguments .length; ++ i)
			{
				var vector = arguments [i];

				x = Math .max (x, vector .x);
				y = Math .max (y, vector .y);
				z = Math .max (z, vector .z);
				w = Math .max (w, vector .w);
			}

			return new Vector4 (x, y, z, w);
		},
	});

	Vector4 .prototype =
	{
		constructor: Vector4,
		length: 4,
		copy: function ()
		{
			return new Vector4 (this .x,
			                    this .y,
			                    this .z,
			                    this .w);
		},
		assign: function (vector)
		{
			this .x = vector .x;
			this .y = vector .y;
			this .z = vector .z;
			this .w = vector .w;
			return this;
		},
		set: function (x, y, z, w)
		{
			this .x = x;
			this .y = y;
			this .z = z;
			this .w = w;
			return this;
		},
		equals: function (vector)
		{
			return this .x === vector .x &&
			       this .y === vector .y &&
			       this .z === vector .z &&
			       this .w === vector .w;
		},
		negate: function ()
		{
			this .x = -this .x;
			this .y = -this .y;
			this .z = -this .z;
			this .w = -this .w;
			return this;
		},
		add: function (vector)
		{
			this .x += vector .x;
			this .y += vector .y;
			this .z += vector .z;
			this .w += vector .w;
			return this;
		},
		subtract: function (vector)
		{
			this .x -= vector .x;
			this .y -= vector .y;
			this .z -= vector .z;
			this .w -= vector .w;
			return this;
		},
		multiply: function (value)
		{
			this .x *= value;
			this .y *= value;
			this .z *= value;
			this .w *= value;
			return this;
		},
		multVec: function (vector)
		{
			this .x *= vector .x;
			this .y *= vector .y;
			this .z *= vector .z;
			this .w *= vector .w;
			return this;
		},
		divide: function (value)
		{
			this .x /= value;
			this .y /= value;
			this .z /= value;
			this .w /= value;
			return this;
		},
		divVec: function (vector)
		{
			this .x /= vector .x;
			this .y /= vector .y;
			this .z /= vector .z;
			this .w /= vector .w;
			return this;
		},
		normalize: function ()
		{
			var length = this .abs ();
			
			if (length)
				return this .divide (length);

			return this .set (0, 0, 0, 0);
		},
		dot: function (vector)
		{
			return this .x * vector .x +
			       this .y * vector .y +
			       this .z * vector .z +
			       this .w * vector .w;
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
			       this .y + " " +
			       this .z + " " +
			       this .w;
		},
	};

	Object .defineProperty (Vector4 .prototype, "0",
	{
		get: function () { return this .x; },
		set: function (value) { this .x = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Vector4 .prototype, "1",
	{
		get: function () { return this .y; },
		set: function (value) { this .y = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Vector4 .prototype, "2",
	{
		get: function () { return this .z; },
		set: function (value) { this .z = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Vector4 .prototype, "3",
	{
		get: function () { return this .w; },
		set: function (value) { this .w = value; },
		enumerable: false,
		configurable: false
	});

	return Vector4;
});
