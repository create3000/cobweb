

define ([
	"jquery",
	"standard/Math/Numbers/Quaternion",
	"standard/Math/Numbers/Vector3",
],
function ($, Quaternion, Vector3)
{
	function Rotation4 (x, y, z, angle)
	{
		switch (arguments .length)
		{
			case 0:
			{
				this .value = new Quaternion (0, 0, 0, 1);
				return;
			}
			case 1:
			{
				this .value = arguments [0];
				return;
			}
			case 2:
			{
				if (arguments [1] instanceof Vector3)
				{
					// https://bitbucket.org/Coin3D/coin/src/abc9f50968c9/src/base/SbRotation.cpp

					var from = arguments [0] .normalize ();
					var to   = arguments [1] .normalize ();

					var cos_angle = from .dot (to);
					var crossvec  = Vector3 .cross (from, to) .normalize ();
					var crosslen  = crossvec .abs ();

					if (crosslen == 0)
					{
						// Parallel vectors
						// Check if they are pointing in the same direction.
						if (cos_angle > 0)
							this .value = new Quaternion (0, 0, 0, 1); // standard rotation

						// Ok, so they are parallel and pointing in the opposite direction
						// of each other.
						else
						{
							// Try crossing with x axis.
							var t = Vector3 .cross (from, Vector3 (1, 0, 0));

							// If not ok, cross with y axis.
							if (t .norm () == 0)
								t = Vector3 .cross (from , Vector3 (0, 1, 0));

							t .normalize ();

							this .value = Quaternion (t .x, t .y, t .z, 0);
						}
					}
					else
					{
						// Vectors are not parallel
						// The abs () wrapping is to avoid problems when `dot' "overflows" a tiny wee bit,
						// which can lead to sqrt () returning NaN.
						crossvec .multiply (Math .sqrt (Math .abs (1 - cos_angle) / 2));

						this .value = new Quaternion (crossvec .x,
						                              crossvec .y,
						                              crossvec .z,
						                              Math .sqrt (Math .abs (1 + cos_angle) / 2));
					}

					return;
				}
				
				this .set (arguments [0] .x,
				           arguments [0] .y,
				           arguments [0] .z,
				           angle);
				
				return;
			}
			case 4:
			{
				this .set (x, y, z, angle);
				return;
			}
		}
	}

	$.extend (Rotation4,
	{
		Identity: new Rotation4 (),
	});

	Rotation4 .prototype =
	{
		constructor: Rotation4,
		length: 4,
		copy: function ()
		{
			return new Rotation4 (this .value .copy ());
		},
		assign: function (rotation)
		{
			this .value .assign (rotation .value);
		},
		set: function (x, y, z, angle)
		{
			var scale = Math .sqrt (x * x + y * y + z * z);

			if (scale == 0)
			{
				this .value = new Quaternion (0, 0, 0, 1);
				return;
			}

			// Calculate quaternion

			var halfTheta = angle / 2;
			scale = Math .sin (halfTheta) / scale;

			this .value = new Quaternion (x * scale,
			                              y * scale,
			                              z * scale,
			                              Math .cos (halfTheta));
		},
		get: function ()
		{
			if (Math .abs (this .value .w) == 1)
				return [0, 0, 1, 0];

			var vector = this .value .imag () .normalize ();

			return [ vector .x,
				      vector .y,
				      vector .z,
				      2 * Math .acos (this .value .w) ];
		},
		getAxis: function ()
		{
			if (Math .abs (this .value .w) == 1)
				return new Vector3 (0, 0, 1);

			return this .value .imag () .normalize ();
		},
		equals: function (rot)
		{
			return this .value .equals (rot .value);
		},
		inverse: function ()
		{
			return new Rotation4 (this .value .inverse ());
		},
		multLeft: function (rot)
		{
			return new Rotation4 (this .value .multLeft (rot .value) .normalize ());
		},
		multRight: function (rot)
		{
			return new Rotation4 (this .value .multRight (rot .value) .normalize ());
		},
		multVecRot: function (vector)
		{
			return this .value .multVecQuat (vector);
		},
		multRotVec: function (vector)
		{
			return this .value .multQuatVec (vector);
		},
		slerp: function (destination, t)
		{
			return new Rotation4 (this .value .slerp (destination .value, t));
		},
		toString: function ()
		{
			var r = this .get ();
			return r [0] + " " +
			       r [1] + " " +
			       r [2] + " " +
			       r [3];
		}
	};

	Object .defineProperty (Rotation4 .prototype, "x",
	{
		get: function ()
		{
			return this .getAxis () .x;
		},
		set: function (value)
		{
			var r = this .get ();
			this .set (value, r [1], r [2], r [3]);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "0",
	{
		get: function ()
		{
			return this .getAxis () .x;
		},
		set: function (value)
		{
			var r = this .get ();
			this .set (value, r [1], r [2], r [3]);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "y",
	{
		get: function ()
		{
			return this .getAxis () .y;
		},
		set: function (value)
		{
			var r = this .get ();
			this .set (r [0], value, r [2], r [3]);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "1",
	{
		get: function ()
		{
			return this .getAxis () .y;
		},
		set: function (value)
		{
			var r = this .get ();
			this .set (r [0], value, r [2], r [3]);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "z",
	{
		get: function ()
		{
			return this .getAxis () .z;
		},
		set: function (value)
		{
			var r = this .get ();
			this .set (r [0], r [1], value, r [3]);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "2",
	{
		get: function ()
		{
			return this .getAxis () .z;
		},
		set: function (value)
		{
			var r = this .get ();
			this .set (r [0], r [1], value, r [3]);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "angle",
	{
		get: function ()
		{
			if (Math .abs (this .value .w == 1))
				return 0;

			return 2 * Math .acos (this .value .w);
		},
		set: function (value)
		{
			var v = this .getAxis ();
			this .set (v .x, v .y, v .z, value);
		},
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Rotation4 .prototype, "3",
	{
		get: function ()
		{
			if (Math .abs (this .value .w == 1))
				return 0;

			return 2 * Math .acos (this .value .w);
		},
		set: function (value)
		{
			var v = this .getAxis ();
			this .set (v .x, v .y, v .z, value);
		},
		enumerable: false,
		configurable: false
	});

	$.extend (Rotation4,
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

			return new Rotation4 (quat);
		},
		squad: function (source, a, b, destination, t)
		{
			return new Rotation4 (Quaternion .squad (source .value, a, b, destination .value, t));
		},
		bezier: function (source, a, b, destination, t)
		{
			return new Rotation4 (Quaternion .bezier (source .value, a, b, destination .value, t));
		},
		spline: function (q0, a1, q2)
		{
			return new Rotation4 (Quaternion .spline (q0 .value, q1 .value, q2 .value));
		},
	});

	return Rotation4;
});