
define ([
	"jquery",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Algorithms/eigendecomposition",
],
function ($, Vector2, Vector3, Matrix3, eigendecomposition)
{
	var
		dummyTranslation      = new Vector2 (),
		dummyRotation         = new Vector3 (),
		dummyScale            = new Vector2 (),
		dummyScaleOrientation = new Vector3 (),
		dummyCenter           = new Vector2 ();
								
	function Matrix3 ()
	{
		switch (arguments .length)
		{
			case 0:
				this .identity ();
				break;
			case 9:
				this .assign (arguments);
				break;
		}
	}

	Matrix3 .prototype =
	{
		constructor: Matrix3,
		order: 3,
		length: 9,
		copy: function ()
		{
			var copy = Object .create (Matrix3 .prototype);
			copy .assign (this);
			return copy;
		},
		assign: function (matrix)
		{
			this [0] = matrix [0];
			this [1] = matrix [1];
			this [2] = matrix [2];
			this [3] = matrix [3];
			this [4] = matrix [4];
			this [5] = matrix [5];
			this [6] = matrix [6];
			this [7] = matrix [7];
			this [8] = matrix [8];
			return this;
		},
		equals: function (matrix)
		{
			return this [0] === matrix [0] &&
			       this [1] === matrix [1] &&
			       this [2] === matrix [2] &&
			       this [3] === matrix [3] &&
			       this [4] === matrix [4] &&
			       this [5] === matrix [5] &&
			       this [6] === matrix [6] &&
			       this [7] === matrix [7] &&
			       this [8] === matrix [8];
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
			switch (arguments .length)
			{
				case 0:
				{
					this .identity ();
					break;
				}
				case 1:
				{
					if (translation === null) translation = Vector2 .Zero;

					this .identity ();
					this .translate (translation);
					break;
				}
				case 2:
				{
					if (translation === null) translation = Vector2 .Zero;
					if (rotation    === null) rotation    = Vector3 .Zero;

					this .identity ();
					this .translate (translation);

					if (rotation [2] !== 0)
						this .rotate (rotation [2]);

					break;
				}
				case 3:
				{
					if (translation === null) translation = Vector2 .Zero;
					if (rotation    === null) rotation    = Vector3 .Zero;
					if (scale       === null) scale       = Vector2 .One;

					this .identity ();
					this .translate (translation);

					if (rotation [2] !== 0)
						this .rotate (rotation [2]);

					if (! scale .equals (Vector2 .One))
						this .scale  (scale);

					break;
				}
				case 4:
				{
					if (translation      === null) translation      = Vector2 .Zero;
					if (rotation         === null) rotation         = Vector3 .Zero;
					if (scale            === null) scale            = Vector2 .One;
					if (scaleOrientation === null) scaleOrientation = Vector3 .Zero;

					this .identity ();
					this .translate (translation);

					if (rotation [2] !== 0)
						this .rotate (rotation [2]);

					if (! scale .equals (Vector2 .One))
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
					if (translation      === null) translation      = Vector2 .Zero;
					if (rotation         === null) rotation         = Vector3 .Zero;
					if (scale            === null) scale            = Vector2 .One;
					if (scaleOrientation === null) scaleOrientation = Vector3 .Zero;
					if (center           === null) center           = Vector2 .Zero;

					// P' = T * C * R * SR * S * -SR * -C * P
					this .identity ();
					this .translate (translation);

					var hasCenter = ! center .equals (Vector2 .Zero);

					if (hasCenter)
						this .translate (center);

					if (rotation [2] !== 0)
						this .rotate (rotation [2]);

					if (! scale .equals (Vector2 .One))
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
						this .translate (center .copy () .negate ());

					break;
				}
				case 9:
				{
					this [0] = arguments [0];
					this [1] = arguments [1];
					this [2] = arguments [2];
					this [3] = arguments [3];
					this [4] = arguments [4];
					this [5] = arguments [5];
					this [6] = arguments [6];
					this [7] = arguments [7];
					this [8] = arguments [8];
					break;
				}
			}
		},
		get: function (translation, rotation, scale, scaleOrientation, center)
		{
			if (translation      === null) translation      = dummyTranslation;
			if (rotation         === null) rotation         = dummyRotation;
			if (scale            === null) scale            = dummyScale;
			if (scaleOrientation === null) scaleOrientation = dummyScaleOrientation;
			if (center           === null) center           = dummyCenter;
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
			var tmp;

			tmp = this [1]; this [1] = this [3]; this [3] = tmp;
			tmp = this [2]; this [2] = this [6]; this [6] = tmp;
			tmp = this [5]; this [5] = this [7]; this [7] = tmp;

			return this;
		},
		inverse: function ()
		{
			var t4  = this [0] * this [4];
			var t6  = this [0] * this [7];
			var t8  = this [3] * this [1];
			var t10 = this [3] * this [7];
			var t12 = this [6] * this [1];
			var t14 = this [6] * this [4];

			var d = (t4 * this [8] - t6 * this [5] - t8 * this [8] + t10 * this [2] + t12 * this [5] - t14 * this [2]);

			if (d === 0)
				throw new Error ("Matrix3 .inverse: determinant is 0.");

			var
				m0 =  (this [4] * this [8] - this [7] * this [5]) / d,
				m1 = -(this [1] * this [8] - this [7] * this [2]) / d,
				m2 =  (this [1] * this [5] - this [4] * this [2]) / d,
				m3 = -(this [3] * this [8] - this [6] * this [5]) / d,
				m4 =  (this [0] * this [8] - this [6] * this [2]) / d,
				m5 = -(this [0] * this [5] - this [3] * this [2]) / d;
	
			this [0] = m0;
			this [1] = m1;
			this [2] = m2;
			this [3] = m3;
			this [4] = m4;
			this [5] = m5;
			this [6] =  (t10 - t14) / d;
			this [7] = -(t6 - t12) / d;
			this [8] =  (t4 - t8) / d;

			return this;
		},
		multLeft: function (matrix)
		{
			var a = this, b = matrix;

			this .set (a[0] * b[0] + a[3] * b[1] + a[6] * b[2],
				        a[1] * b[0] + a[4] * b[1] + a[7] * b[2],
				        a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
				        a[0] * b[3] + a[3] * b[4] + a[6] * b[5],
				        a[1] * b[3] + a[4] * b[4] + a[7] * b[5],
				        a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
				        a[0] * b[6] + a[3] * b[7] + a[6] * b[8],
				        a[1] * b[6] + a[4] * b[7] + a[7] * b[8],
				        a[2] * b[6] + a[5] * b[7] + a[8] * b[8]);

			return this;
		},
		multRight: function (matrix)
		{
			var a = this, b = matrix;

			this .set (a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
				        a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
				        a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
				        a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
				        a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
				        a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
				        a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
				        a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
				        a[6] * b[2] + a[7] * b[5] + a[8] * b[8]);

			return this;
		},
		multVecMatrix: function (vector)
		{
			if (vector instanceof Vector2)
			{
				var w = vector .x * this [2] + vector .y * this [5] + this [8];

				return vector .set ((vector .x * this [0] + vector .y * this [3] + this [6]) / w,
				                    (vector .x * this [1] + vector .y * this [4] + this [7]) / w);
			}

			return vector .set (vector .x * this [0] + vector .y * this [3] + vector .z * this [6],
			                    vector .x * this [1] + vector .y * this [4] + vector .z * this [7],
			                    vector .x * this [2] + vector .y * this [5] + vector .z * this [8]);
		},
		multMatrixVec: function (vector)
		{
			if (vector instanceof Vector2)
			{
				var w = vector .x * this [6] + vector .y * this [7] + this [8];

				return vector .set ((vector .x * this [0] + vector .y * this [1] + this [2]) / w,
				                    (vector .x * this [3] + vector .y * this [4] + this [5]) / w);
			}

			return vector .set (vector .x * this [0] + vector .y * this [1] + vector .z * this [2],
			                    vector .x * this [3] + vector .y * this [4] + vector .z * this [5],
			                    vector .x * this [6] + vector .y * this [7] + vector .z * this [8]);
		},
		multDirMatrix: function (vector)
		{
			return vector .set (vector .x * this [0] + vector .y * this [3],
			                    vector .x * this [1] + vector .y * this [4]);
		},
		multMatrixDir: function (vector)
		{
			return vector .set (vector .x * this [0] + vector .y * this [1],
			                    vector .x * this [3] + vector .y * this [4]);
		},
		identity: function ()
		{
			this [0] = 1; this [1] = 0; this [2] = 0;
			this [3] = 0; this [4] = 1; this [5] = 0;
			this [6] = 0; this [7] = 0; this [8] = 1;
		},
		translate: function (translation)
		{
			this [6] += this [0] * translation .x + this [3] * translation .y;
			this [7] += this [1] * translation .x + this [4] * translation .y;
		},
		rotate: function (rotation)
		{
			this .multLeft (Matrix3 .Rotation (rotation));
		},
		scale: function (scale)
		{
			this [0] *= scale .x;
			this [3] *= scale .y;

			this [1] *= scale .x;
			this [4] *= scale .y;
		},
		toString: function ()
		{
			return this [0] + " " + this [1] + " " + this [2] + " " +
			       this [3] + " " + this [4] + " " + this [5] + " " +
			       this [6] + " " + this [7] + " " + this [8]
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

	$.extend (Matrix3,
	{
		Identity: new Matrix3 (),
		Rotation: function (rotation)
		{
			var
				sinAngle = Math .sin (rotation),
				cosAngle = Math .cos (rotation);

			return new Matrix3 ( cosAngle, sinAngle, 0,
			                    -sinAngle, cosAngle, 0,
			                     0, 0, 1);
		},
		Matrix2: function (matrix)
		{
			return new Matrix3 (matrix [0], matrix [1], 0,
			                    matrix [2], matrix [3], 0,
			                    0, 0, 1);
		},
		transpose: function (matrix)
		{
			return matrix .copy () .transpose ();
		},
		inverse: function (matrix)
		{
			return matrix .copy () .inverse ();
		},
		multiply: function (lhs, rhs)
		{
			return lhs .copy () .multRight (rhs);
		},
	});

	return Matrix3;
});
