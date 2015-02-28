
define ([
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Algorithms/eigendecomposition",
],
function (Vector2, Vector3, Matrix3, eigendecomposition)
{
	function Matrix3 (m00, m01, m02,
	                  m10, m11, m12,
	                  m20, m21, m22)
	{
		if (arguments .length)
		{
			for (var i = 0; i < this .length; ++ i)
				this [i] = arguments [i];
		}
		else
			this .set ();
	}

	Matrix3 .Rotation = function (rotation)
	{
		var sinAngle = Math .sin (rotation);
		var cosAngle = Math .cos (rotation);
		var matrix   = new Matrix3 ();

		matrix [0] =  cosAngle;
		matrix [1] =  sinAngle;
		matrix [3] = -sinAngle;
		matrix [4] =  cosAngle;

		return matrix;
	};

	Matrix3 .Matrix2 = function (matrix)
	{
		return new Matrix3 (matrix [0], matrix [1], 0,
		                    matrix [2], matrix [3], 0,
		                    0, 0, 1);
	};

	Matrix3 .prototype =
	{
		constructor: Matrix3,
		order: 3,
		length: 9,
		copy: function ()
		{
			return new Matrix3 (this [0], this [1], this [2],
			                    this [3], this [4], this [5],
			                    this [6], this [7], this [8]);
		},
		assign: function (matrix)
		{
			for (var i = 0; i < this .length; ++ i)
				this [i] = matrix [i];
		},
		equals: function (matrix)
		{
			for (var i = 0; i < this .length; ++ i)
			{
				if (this [i] !== matrix [i])
					return false;
			}

			return true;
		},
		rotation: function ()
		{
			return math .atan2 (this [1], this [0]);
		},
		set1: function (r, c, value)
		{
			this [r * this .order + c] = value;
		},
		get1: function (r, c)
		{
			return this [r * this .order + c];
		},
		set: function (translation, rotation, scale, scaleOrientation, center)
		{
			if (arguments .length)
			{
				if (translation === null)      translation      = new Vector2 ();
				if (rotation === null)         rotation         = new Vector3 ();
				if (scale === null)            scale            = new Vector2 (1, 1);
				if (scaleOrientation === null) scaleOrientation = new Vector3 ();
				if (center === null)           center           = new Vector2 ();

				switch (arguments .length)
				{
					case 1:
					{
						this .set ();
						this .translate (translation);
						break;
					}
					case 2:
					{
						this .set ();
						this .translate (translation);

						if (rotation [2] !== 0)
							this .rotate (rotation [2]);

						break;
					}
					case 3:
					{
						this .set ();
						this .translate (translation);

						if (rotation [2] !== 0)
							this .rotate (rotation [2]);

						if (! scale .equals (new Vector2 (1, 1)))
							this .scale  (scale);

						break;
					}
					case 4:
					{
						this .set ();
						this .translate (translation);

						if (rotation [2] !== 0)
							this .rotate (rotation [2]);

						if (! scale .equals (new Vector2 (1, 1)))
						{
							var hasScaleOrientation = scaleOrientation [2] !== 0;

							if (hasScaleOrientation)
							{
								this .rotate (scaleOrientation [2]);
								this .scale (scale);
								this .rotate (-scaleOrientation [2]);
							}
							else
								this .scale (scale);
						}

						break;
					}
					case 5:
					{
						// P' = T * C * R * SR * S * -SR * -C * P
						this .set ();
						this .translate (translation);

						var hasCenter = ! center .equals (new Vector2 ());

						if (hasCenter)
							this .translate (center);

						if (rotation [2] !== 0)
							this .rotate (rotation [2]);

						if (! scale .equals (new Vector2 (1, 1)))
						{
							if (scaleOrientation [2] !== 0)
							{
								this .rotate (scaleOrientation [2]);
								this .scale (scale);
								this .rotate (-scaleOrientation [2]);
							}
							else
								this .scale (scale);
						}

						if (hasCenter)
							this .translate (center .negate ());

						break;
					}
					case 9:
					{
						for (var i = 0; i < this .length; ++ i)
							this [i] = arguments [i];

						break;
					}
				}
			}
			else
			{
				this [0] = 1; this [1] = 0; this [2] = 0;
				this [3] = 0; this [4] = 1; this [5] = 0;
				this [6] = 0; this [7] = 0; this [8] = 1;
			}
		},
		get: function (translation, rotation, scale, scaleOrientation, center)
		{
			if (translation === null)      translation      = new Vector2 ();
			if (rotation === null)         rotation         = new Vector3 ();
			if (scale === null)            scale            = new Vector2 (1, 1);
			if (scaleOrientation === null) scaleOrientation = new Vector3 ();
			if (center === null)           center           = new Vector2 ();
		},
		determinant2: function ()
		{
			return this [0] * this [4] -
			       this [1] * this [3];
		},
		determinant: function ()
		{
			return this [0] * (this [4] * this [8] - this [5] * this [7]) -
			       this [1] * (this [3] * this [8] - this [5] * this [6]) +
			       this [2] * (this [3] * this [7] - this [4] * this [6]);
		},
		transpose: function ()
		{
			return new Matrix3 (this [0], this [3], this [6],
			                    this [1], this [4], this [7],
			                    this [2], this [5], this [8]);
		},
		negate: function ()
		{
			return new Matrix3 (-this [0], -this [1], -this [2],
			                    -this [3], -this [4], -this [5],
			                    -this [6], -this [7], -this [8]);
		},
		inverse: function ()
		{
			var
				t4  = this [0] * this [4],
				t6  = this [0] * this [7],
				t8  = this [3] * this [1],
				t10 = this [3] * this [7],
				t12 = this [6] * this [1],
				t14 = this [6] * this [4],
				d   = t4 * this [8] - t6 * this [5] - t8 * this [8] + t10 * this [2] + t12 * this [5] - t14 * this [2];

			if (d === 0)
				throw Error ("Matrix3 .inverse: determinant is 0.");

			return new Matrix3 ( (this [4] * this [8] - this [7] * this [5]) / d,
			                     (this [1] * this [8] - this [7] * this [2]) / d,
			                     (this [1] * this [5] - this [4] * this [2]) / d,

			                    -(this [3] * this [8] - this [6] * this [5]) / d,
			                     (this [0] * this [8] - this [6] * this [2]) / d,
			                    -(this [0] * this [5] - this [3] * this [2]) / d,

			                     (t10 - t14) / d,
			                    -(t6 - t12) / d,
			                     (t4 - t8) / d);
		},
		multLeft: function (matrix)
		{
			var a = this, b = matrix;

			return new Matrix3 (a[0] * b[0] + a[3] * b[1] + a[6] * b[2],
				                 a[1] * b[0] + a[4] * b[1] + a[7] * b[2],
				                 a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
				                 a[0] * b[3] + a[3] * b[4] + a[6] * b[5],
				                 a[1] * b[3] + a[4] * b[4] + a[7] * b[5],
				                 a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
				                 a[0] * b[6] + a[3] * b[7] + a[6] * b[8],
				                 a[1] * b[6] + a[4] * b[7] + a[7] * b[8],
				                 a[2] * b[6] + a[5] * b[7] + a[8] * b[8]);
		},
		multRight: function (matrix)
		{
			var a = this, b = matrix;

			return new Matrix3 (a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
				                 a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
				                 a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
				                 a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
				                 a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
				                 a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
				                 a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
				                 a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
				                 a[6] * b[2] + a[7] * b[5] + a[8] * b[8]);
		},
		multVecMatrix: function (vector)
		{
			if (vector instanceof Vector2)
			{
				var w = vector .x * this [2] + vector .y * this [5] + this [8];

				return new Vector2 ((vector .x * this [0] + vector .y * this [3] + this [6]) / w,
				                    (vector .x * this [1] + vector .y * this [4] + this [7]) / w);
			}

			return new Vector3 (vector .x * this [0] + vector .y * this [3] + vector .z * this [6],
			                    vector .x * this [1] + vector .y * this [4] + vector .z * this [7],
			                    vector .x * this [2] + vector .y * this [5] + vector .z * this [8]);
		},
		multMatrixVec: function (vector)
		{
			if (vector instanceof Vector2)
			{
				var w = vector .x * this [6] + vector .y * this [7] + this [8];

				return new Vector2 ((vector .x * this [0] + vector .y * this [1] + this [2]) / w,
				                    (vector .x * this [3] + vector .y * this [4] + this [5]) / w);
			}

			return new Vector3 (vector .x * this [0] + vector .y * this [1] + vector .z * this [2],
			                    vector .x * this [3] + vector .y * this [4] + vector .z * this [5],
			                    vector .x * this [6] + vector .y * this [7] + vector .z * this [8]);
		},
		multDirMatrix: function (vector)
		{
			return new Vector2 (vector .x * this [0] + vector .y * this [3],
			                    vector .x * this [1] + vector .y * this [4]);
		},
		multMatrixDir: function (vector)
		{
			return new Vector2 (vector .x * this [0] + vector .y * this [1],
			                    vector .x * this [3] + vector .y * this [4]);
		},
		translate: function (translation)
		{
			this [6] += this [0] * translation .x + this [3] * translation .y;
			this [7] += this [1] * translation .x + this [4] * translation .y;
		},
		rotate: function (rotation)
		{
			this .assign (this .multLeft (Matrix3 .Rotation (rotation)));
		},
		scale: function (scale)
		{
			value [0] *= scale .x;
			value [3] *= scale .y;

			value [1] *= scale .x;
			value [4] *= scale .y;
		},
	};

	Object .defineProperty (Matrix3 .prototype, "x",
	{
		get: function () { return new Vector2 (this [0], this [1]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix3 .prototype, "y",
	{
		get: function () { return new Vector2 (this [3], this [4]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix3 .prototype, "origin",
	{
		get: function () { return new Vector2 (this [6], this [7]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix3 .prototype, "submatrix",
	{
		get: function ()
		{
			return new Matrix2 (this [0], this [1],
			                    this [3], this [4]);
		},
		enumerable: false,
		configurable: false
	});

	return Matrix3;
});
