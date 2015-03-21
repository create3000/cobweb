
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
		dummyTranslation      = new Vector2 (0, 0),
		dummyRotation         = new Vector3 (0, 0, 0),
		dummyScale            = new Vector2 (0, 0),
		dummyScaleOrientation = new Vector3 (0, 0, 0),
		dummyCenter           = new Vector2 (0, 0);
								
	function Matrix3 ()
	{
		if (arguments .length)
			this .assign (arguments);
		else
			this .identity ();
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
			var
				m0  = this [0],
				m1  = this [1],
				m2  = this [2],
				m3  = this [3],
				m4  = this [4],
				m5  = this [5],
				m6  = this [6],
				m7  = this [7],
				m8  = this [8],
				t4  = m0 * m4,
				t6  = m0 * m7,
				t8  = m3 * m1,
				t10 = m3 * m7,
				t12 = m6 * m1,
				t14 = m6 * m4;

			var d = (t4 * m8 - t6 * m5 - t8 * m8 + t10 * m2 + t12 * m5 - t14 * m2);

			if (d === 0)
				throw new Error ("Matrix3 .inverse: determinant is 0.");

			d = 1 / d;

			var
				b0 =  (m4 * m8 - m7 * m5) * d,
				b1 = -(m1 * m8 - m7 * m2) * d,
				b2 =  (m1 * m5 - m4 * m2) * d,
				b3 = -(m3 * m8 - m6 * m5) * d,
				b4 =  (m0 * m8 - m6 * m2) * d,
				b5 = -(m0 * m5 - m3 * m2) * d;
	
			this [0] = b0;
			this [1] = b1;
			this [2] = b2;
			this [3] = b3;
			this [4] = b4;
			this [5] = b5;
			this [6] =  (t10 - t14) * d;
			this [7] = -(t6 - t12) * d;
			this [8] =  (t4 - t8) * d;

			return this;
		},
		multLeft: function (matrix)
		{
			var
				a = this, b = matrix,
				a0 = a[0], a1 = a[1], a2 = a[2],
				a3 = a[3], a4 = a[4], a5 = a[5],
				a6 = a[6], a7 = a[7], a8 = a[8],
				b0 = b[0], b1 = b[1], b2 = b[2],
				b3 = b[3], b4 = b[4], b5 = b[5],
				b6 = b[6], b7 = b[7], b8 = b[8];

			a[0] = a0 * b0 + a3 * b1 + a6 * b2;
			a[1] = a1 * b0 + a4 * b1 + a7 * b2;
			a[2] = a2 * b0 + a5 * b1 + a8 * b2;
			a[3] = a0 * b3 + a3 * b4 + a6 * b5;
			a[4] = a1 * b3 + a4 * b4 + a7 * b5;
			a[5] = a2 * b3 + a5 * b4 + a8 * b5;
			a[6] = a0 * b6 + a3 * b7 + a6 * b8;
			a[7] = a1 * b6 + a4 * b7 + a7 * b8;
			a[8] = a2 * b6 + a5 * b7 + a8 * b8;

			return this;
		},
		multRight: function (matrix)
		{
			var
				a = this, b = matrix,
				a0 = a[0], a1 = a[1], a2 = a[2],
				a3 = a[3], a4 = a[4], a5 = a[5],
				a6 = a[6], a7 = a[7], a8 = a[8],
				b0 = b[0], b1 = b[1], b2 = b[2],
				b3 = b[3], b4 = b[4], b5 = b[5],
				b6 = b[6], b7 = b[7], b8 = b[8];

			a[0] = a0 * b0 + a1 * b3 + a2 * b6;
			a[1] = a0 * b1 + a1 * b4 + a2 * b7;
			a[2] = a0 * b2 + a1 * b5 + a2 * b8;
			a[3] = a3 * b0 + a4 * b3 + a5 * b6;
			a[4] = a3 * b1 + a4 * b4 + a5 * b7;
			a[5] = a3 * b2 + a4 * b5 + a5 * b8;
			a[6] = a6 * b0 + a7 * b3 + a8 * b6;
			a[7] = a6 * b1 + a7 * b4 + a8 * b7;
			a[8] = a6 * b2 + a7 * b5 + a8 * b8;

			return this;
		},
		multVecMatrix: function (vector)
		{
			if (vector .length === 2)
			{
				var
					x = vector .x,
					y = vector .y,
					w = x * this [2] + y * this [5] + this [8];

				vector .x = (x * this [0] + y * this [3] + this [6]) / w;
				vector .y = (x * this [1] + y * this [4] + this [7]) / w;
				
				return vector;
			}

			var
				x = vector .x,
				y = vector .y,
				z = vector .z;

			vector .x = x * this [0] + y * this [3] + z * this [6];
			vector .y = x * this [1] + y * this [4] + z * this [7];
			vector .z = x * this [2] + y * this [5] + z * this [8];

			return vector;
		},
		multMatrixVec: function (vector)
		{
			if (vector .length === 2)
			{
				var
					x = vector .x,
					y = vector .y,
					w = x * this [6] + y * this [7] + this [8];

				vector .x = (x * this [0] + y * this [1] + this [2]) / w;
				vector .y = (x * this [3] + y * this [4] + this [5]) / w;
				
				return vector;
			}

			var
				x = vector .x,
				y = vector .y,
				z = vector .z;

			vector .x = x * this [0] + y * this [1] + z * this [2];
			vector .y = x * this [3] + y * this [4] + z * this [5];
			vector .z = x * this [6] + y * this [7] + z * this [8];

			return vector;
		},
		multDirMatrix: function (vector)
		{
			var
				x = vector .x,
				y = vector .y;

			vector .x = x * this [0] + y * this [3];
			vector .y = x * this [1] + y * this [4];

			return vector;
		},
		multMatrixDir: function (vector)
		{
			var
				x = vector .x,
				y = vector .y;

			vector .x = x * this [0] + y * this [1];
			vector .y = x * this [3] + y * this [4];

			return vector;
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
