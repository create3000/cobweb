
define ([
	"standard/Math/Algorithm",
],
function (Algorithm)
{
	function Vector3 (x, y, z)
	{		
		if (arguments .length)
		{
			this .x = x;
			this .y = y;
			this .z = z;
		}
		else
		{
			this .x = 0;
			this .y = 0;
			this .z = 0;
		}
	}

	Vector3 .prototype =
	{
		constructor: Vector3,
		length: 3,
		copy: function ()
		{
			return new Vector3 (this .x,
			                    this .y,
			                    this .z);
		},
		assign: function (vector)
		{
			this .x = vector .x;
			this .y = vector .y;
			this .z = vector .z;
		},
		set: function (x, y, z)
		{
			this .x = x;
			this .y = y;
			this .z = z;
		},
		equals: function (vector)
		{
			return this .x === vector .x &&
			       this .y === vector .y &&
			       this .z === vector .z;
		},
		negate: function ()
		{
			return new Vector3 (-this .x,
			                    -this .y,
			                    -this .z);
		},
		add: function (vector)
		{
			return new Vector3 (this .x + vector .x,
			                    this .y + vector .y,
			                    this .z + vector .z);
		},
		subtract: function (vector)
		{
			return new Vector3 (this .x - vector .x,
			                    this .y - vector .y,
			                    this .z - vector .z);
		},
		multiply: function (value)
		{
			return new Vector3 (this .x * value,
			                    this .y * value,
			                    this .z * value);
		},
		multVec: function (vector)
		{
			return new Vector3 (this .x * vector .x,
			                    this .y * vector .y,
			                    this .z * vector .z);
		},
		divide: function (value)
		{
			return new Vector3 (this .x / value,
			                    this .y / value,
			                    this .z / value);
		},
		divVec: function (vector)
		{
			return new Vector3 (this .x / vector .x,
			                    this .y / vector .y,
			                    this .z / vector .z);
		},
		normalize: function ()
		{
			var length = this .abs ();
			
			if (length)
				return this .divide (length);

			return new Vector3 (0, 0, 0);
		},
		cross: function (vector)
		{
			return new Vector3 (this .y * vector .z - this .z * vector .y,
			                    this .z * vector .x - this .x * vector .z,
			                    this .x * vector .y - this .y * vector .x);
		},
		dot: function (vector)
		{
			return this .x * vector .x +
			       this .y * vector .y +
			       this .z * vector .z;
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
			return new Vector3 (Algorithm .lerp (this .x, vector .x, t),
			                    Algorithm .lerp (this .y, vector .y, t),
			                    Algorithm .lerp (this .z, vector .z, t));
		},
		min: function (vector)
		{
			return new Vector3 (Math .min (this .x, vector .x),
			                    Math .min (this .y, vector .y),
			                    Math .min (this .z, vector .z));
		},
		max: function (vector)
		{
			return new Vector3 (Math .max (this .x, vector .x),
			                    Math .max (this .y, vector .y),
			                    Math .max (this .z, vector .z));
		},
		toString: function ()
		{
			return this .x + " " +
			       this .y + " " +
			       this .z;
		}
	};

	Object .defineProperty (Vector3 .prototype, "0",
	{
		get: function () { return this .x; },
		set: function (value) { this .x = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Vector3 .prototype, "1",
	{
		get: function () { return this .y; },
		set: function (value) { this .y = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Vector3 .prototype, "2",
	{
		get: function () { return this .z; },
		set: function (value) { this .z = value; },
		enumerable: false,
		configurable: false
	});

	return Vector3;
});
