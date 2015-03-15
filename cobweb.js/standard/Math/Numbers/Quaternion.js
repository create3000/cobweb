
define ([
	"jquery",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($, Vector3, Algorithm)
{
	function Quaternion (x, y, z, w)
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

	Quaternion .prototype =
	{
		constructor: Quaternion,
		length: 4,
		copy: function ()
		{
			return new Quaternion (this .x,
			                       this .y,
			                       this .z,
			                       this .w);
		},
		assign: function (quat)
		{
			this .x = quat .x;
			this .y = quat .y;
			this .z = quat .z;
			this .w = quat .w;
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
		isReal: function ()
		{
			return ! (this .x || this .y || this .z);
		},
		isImag: function ()
		{
			return ! this .w;
		},
		equals: function (quat)
		{
			return this .x === quat .x &&
			       this .y === quat .y &&
			       this .z === quat .z &&
			       this .w === quat .w;
		},
		negate: function ()
		{
			this .x = -this .x;
			this .y = -this .y;
			this .z = -this .z;
			this .w = -this .w;
			return this;
		},
		inverse: function ()
		{
			this .x = -this .x;
			this .y = -this .y;
			this .z = -this .z;
			return this;
		},
		add: function (quat)
		{
			this .x += quat .x;
			this .y += quat .y;
			this .z += quat .z;
			this .w += quat .w;
			return this;
		},
		subtract: function (quat)
		{
			this .x -= quat .x;
			this .y -= quat .y;
			this .z -= quat .z;
			this .w -= quat .w;
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
		multLeft: function (quat)
		{
			return this .set (this .w * quat .x +
			                  this .x * quat .w +
			                  this .y * quat .z -
			                  this .z * quat .y,

			                  this .w * quat .y +
			                  this .y * quat .w +
			                  this .z * quat .x -
			                  this .x * quat .z,

			                  this .w * quat .z +
			                  this .z * quat .w +
			                  this .x * quat .y -
			                  this .y * quat .x,

			                  this .w * quat .w -
			                  this .x * quat .x -
			                  this .y * quat .y -
			                  this .z * quat .z);
		},
		multRight: function (quat)
		{
			return this .set (quat .w * this .x +
			                  quat .x * this .w +
			                  quat .y * this .z -
			                  quat .z * this .y,

			                  quat .w * this .y +
			                  quat .y * this .w +
			                  quat .z * this .x -
			                  quat .x * this .z,

			                  quat .w * this .z +
			                  quat .z * this .w +
			                  quat .x * this .y -
			                  quat .y * this .x,

			                  quat .w * this .w -
			                  quat .x * this .x -
			                  quat .y * this .y -
			                  quat .z * this .z);
		},
		divide: function (value)
		{
			this .x /= value;
			this .y /= value;
			this .z /= value;
			this .w /= value;
			return this;
		},
		multVecQuat: function (vector)
		{
			var a = this .w * this .w - this .x * this .x - this .y * this .y - this .z * this .z;                     
			var b = 2 * (vector .x * this .x + vector .y * this .y + vector .z * this .z);  
			var c = 2 * this .w;                                       

			return vector .set (a * vector .x + b * this .x + c * (this .y * vector .z - this .z * vector .y),
			                    a * vector .y + b * this .y + c * (this .z * vector .x - this .x * vector .z),
			                    a * vector .z + b * this .z + c * (this .x * vector .y - this .y * vector .x));
		},
		multQuatVec: function (vector)
		{
			var a = this .w * this .w - this .x * this .x - this .y * this .y - this .z * this .z;                     
			var b = 2 * (vector .x * this .x + vector .y * this .y + vector .z * this .z);  
			var c = 2 * this .w;                                       

			return vector .set (a * vector .x + b * this .x - c * (this .y * vector .z - this .z * vector .y),
			                    a * vector .y + b * this .y - c * (this .z * vector .x - this .x * vector .z),
			                    a * vector .z + b * this .z - c * (this .x * vector .y - this .y * vector .x));
		},
		normalize: function ()
		{
			var length = this .abs ();
			
			if (length)
				return this .divide (length);

			return this;
		},
		dot: function (quat)
		{
			return this .x * quat .x +
			       this .y * quat .y +
			       this .z * quat .z +
			       this .w * quat .w;
		},
		norm: function ()
		{
			return this .dot (this);
		},
		abs: function ()
		{
			return Math .sqrt (this .norm ());
		},
		pow: function (exponent)
		{
			if (exponent instanceof Quaternion)
				return this .exp (exponent * this .log ());

			if (this .isReal ())
				return this .set (0, 0, 0, Math .pow (this .w, exponent));

			var l     = this .abs ();
			var theta = Math .acos (this .w / l);
			var li    = this .imag .abs ();
			var ltoe  = Math .pow (l, exponent);
			var et    = exponent * theta;
			var scale = ltoe / li * Math .sin (et);

			this .x *= scale;
			this .y *= scale;
			this .z *= scale;
			this .w  = ltoe * Math .cos (et);
			return this;
		},
		log: function ()
		{
			if (this .isReal ())
			{
				if (this .w > 0)
					return this .set (0, 0, 0, Math .log (this .w));

				else
					return this .set (Math .PI, 0, 0, Math .log (-this .w));
			}

			var l = this .abs ();
			var v = this .imag .normalize () .multiply (Math .acos (this .w / l));
			var w = Math .log (l);

			return this .set (v .x, v .y, v .z, w);
		},
		exp: function ()
		{	
			if (this .isReal ())
				return this .set (0, 0, 0, Math .exp (this .w));

			var i  = this .imag;
			var li = i .abs ();
			var ew = Math .exp (this .w);
			var w  = ew * Math .cos (li);
			var v  = i .multiply (ew * Math .sin (li) / li);

			return this .set (v .x, v .y, v .z, w);
		},
		toString: function ()
		{
			return this .x + " " +
			       this .y + " " +
			       this .z + " " +
			       this .w;
		}
	};

	Object .defineProperty (Quaternion .prototype, "0",
	{
		get: function () { return this .x; },
		set: function (value) { this .x = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Quaternion .prototype, "1",
	{
		get: function () { return this .y; },
		set: function (value) { this .y = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Quaternion .prototype, "2",
	{
		get: function () { return this .z; },
		set: function (value) { this .z = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Quaternion .prototype, "3",
	{
		get: function () { return this .w; },
		set: function (value) { this .w = value; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Quaternion .prototype, "real",
	{
		get: function () { return this .w; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Quaternion .prototype, "imag",
	{
		get: function ()
		{
			return new Vector3 (this .x,
			                    this .y,
			                    this .z);
		},
		enumerable: false,
		configurable: false
	});

	$.extend (Quaternion,
	{
		Matrix3: function (matrix)
		{
			var quat = new Quaternion ();

			var i;

			// First, find largest diagonal in matrix:
			if (matrix [0] > matrix [4])
			{
				i = matrix [0] > matrix [8] ? 0 : 2;
			}
			else
			{
				i = matrix [4] > matrix [8] ? 1 : 2;
			}

			var scalerow = matrix [0] + matrix [4] + matrix [8];

			if (scalerow > matrix [i * 3 + i])
			{
				// Compute w first:
				quat [3] = Math .sqrt (scalerow + 1) / 2;

				// And compute other values:
				var d = 4 * quat [3];
				quat [0] = (matrix [5] - matrix [7]) / d;
				quat [1] = (matrix [6] - matrix [2]) / d;
				quat [2] = (matrix [1] - matrix [3]) / d;
			}
			else
			{
				// Compute x, y, or z first:
				var j = (i + 1) % 3;
				var k = (i + 2) % 3;

				// Compute first value:
				quat [i] = Math .sqrt (matrix [i * 3 + i] - matrix [j * 3 + j] - matrix [k * 3 + k] + 1) / 2;

				// And the others:
				var d = 4 * quat [i];
				quat [j] = (matrix [i * 3 + j] + matrix [j * 3 + i]) / d;
				quat [k] = (matrix [i * 3 + k] + matrix [k * 3 + i]) / d;
				quat [3] = (matrix [j * 3 + k] - matrix [k * 3 + j]) / d;
			}

			return quat;
		},
		slerp: Algorithm .slerp,
		squad: function (source, a, b, destination, t)
		{
			// We must use shortest path slerp to prevent flipping.  Also see spline.

			return Algorithm .slerp (Algorithm .slerp (source, destination, t), Algorithm .slerp (a, b, t), 2 * t * (1 - t));
		},
		bezier: function (q0, a, b, q1, t)
		{
			var q11 = Algorithm .slerp (q0,  a, t);
			var q12 = Algorithm .slerp ( a,  b, t);
			var q13 = Algorithm .slerp ( b, q1, t);

			return Algorithm .slerp (Algorithm .slerp (q11, q12, t), Algorithm .slerp (q12, q13, t), t);
		},
		spline: function (q0, q1, q2)
		{
			// If the dot product is smaller than 0 we must negate the quaternion to prevent flipping. If we negate all
			// the terms we get a different quaternion but it represents the same rotation.

			if (q0 .dot (q1) < 0)
				q0 = q0 .copy () .negate ();

			if (q2 .dot (q1) < 0)
				q2 = q2 .copy () .negate ();

			var q1_i = q1 .copy () .inverse ();

			// The result must be normalized as it will be used in slerp and we can only slerp normalized vectors.

			return q1 .copy () .multRight (
				q1_i .copy () .multRight (q0) .log () .add (q1_i .copy () .multRight (q2) .log ()) .divide (-4) .exp ()
			)
			.normalize ();
		}
	});

	return Quaternion;
});
