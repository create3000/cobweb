
define ([
	"jquery",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Algorithms/eigendecomposition",
],
function ($, Vector3, Vector4, Rotation4, Matrix3, eigendecomposition)
{
	var
		dummyTranslation      = new Vector3 (),
		dummyRotation         = new Rotation4 (),
		dummyScale            = new Vector3 (),
		dummyScaleOrientation = new Rotation4 (),
		dummyCenter           = new Vector3 (),
		rot                   = new Matrix3 (),
		so                    = new Matrix3 (),
		si                    = new Matrix3 ();

	function Matrix4 (m00, m01, m02, m03,
	                  m10, m11, m12, m13,
	                  m20, m21, m22, m23,
	                  m30, m31, m32, m33)
	{
		if (arguments .length)
			this .assign (arguments);

		else
			this .identity ();
	}

	Matrix4 .prototype =
	{
		constructor: Matrix4,
		order: 4,
		length: 16,
		copy: function ()
		{
			return new Matrix4 (this [ 0], this [ 1], this [ 2], this [ 3],
			                    this [ 4], this [ 5], this [ 6], this [ 7],
			                    this [ 8], this [ 9], this [10], this [11],
			                    this [12], this [13], this [14], this [15]);
		},
		assign: function (matrix)
		{
			this [ 0] = matrix [ 0];
			this [ 1] = matrix [ 1];
			this [ 2] = matrix [ 2];
			this [ 3] = matrix [ 3];
			this [ 4] = matrix [ 4];
			this [ 5] = matrix [ 5];
			this [ 6] = matrix [ 6];
			this [ 7] = matrix [ 7];
			this [ 8] = matrix [ 8];
			this [ 9] = matrix [ 9];
			this [10] = matrix [10];
			this [11] = matrix [11];
			this [12] = matrix [12];
			this [13] = matrix [13];
			this [14] = matrix [14];
			this [15] = matrix [15];
			return this;
		},
		equals: function (matrix)
		{
			return this [ 0] === matrix [ 0] &&
			       this [ 1] === matrix [ 1] &&
			       this [ 2] === matrix [ 2] &&
			       this [ 3] === matrix [ 3] &&
			       this [ 4] === matrix [ 4] &&
			       this [ 5] === matrix [ 5] &&
			       this [ 6] === matrix [ 6] &&
			       this [ 7] === matrix [ 7] &&
			       this [ 8] === matrix [ 8] &&
			       this [ 9] === matrix [ 9] &&
			       this [10] === matrix [10] &&
			       this [11] === matrix [11] &&
			       this [12] === matrix [12] &&
			       this [13] === matrix [13] &&
			       this [14] === matrix [14] &&
			       this [15] === matrix [15];
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
					if (translation === null) translation = Vector3 .Zero;

					this .identity ();
					this .translate (translation);
					break;
				}
				case 2:
				{
					if (translation === null) translation = Vector3 .Zero;
					if (rotation    === null) rotation    = Rotation4 .Identity;

					this .identity ();
					this .translate (translation);

					if (! rotation .equals (Rotation4 .Identity))
						this .rotate (rotation);

					break;
				}
				case 3:
				{
					if (translation === null) translation = Vector3 .Zero;
					if (rotation    === null) rotation    = Rotation4 .Identity;
					if (scale       === null) scale       = Vector3 .One;

					this .identity ();
					this .translate (translation);

					if (! rotation .equals (Rotation4 .Identity))
						this .rotate (rotation);

					if (! scale .equals (Vector3 .One))
						this .scale  (scale);

					break;
				}
				case 4:
				{
					if (translation      === null) translation      = Vector3 .Zero;
					if (rotation         === null) rotation         = Rotation4 .Identity;
					if (scale            === null) scale            = Vector3 .One;
					if (scaleOrientation === null) scaleOrientation = Rotation4 .Identity;

					this .identity ();
					this .translate (translation);

					if (! rotation .equals (Rotation4 .Identity))
						this .rotate (rotation);

					if (! scale .equals (Vector3 .One))
					{
						var hasScaleOrientation = ! scaleOrientation .equals (Rotation4 .Identity);

						if (hasScaleOrientation)
						{
							this .rotate (scaleOrientation);
							this .scale (scale);
							this .rotate (scaleOrientation .copy () .inverse ());
						}
						else
							this .scale (scale);
					}

					break;
				}
				case 5:
				{
					if (translation      === null) translation      = Vector3 .Zero;
					if (rotation         === null) rotation         = Rotation4 .Identity;
					if (scale            === null) scale            = Vector3 .One;
					if (scaleOrientation === null) scaleOrientation = Rotation4 .Identity;
					if (center           === null) center           = Vector3 .Zero;

					// P' = T * C * R * SR * S * -SR * -C * P
					this .identity ();
					this .translate (translation);

					var hasCenter = ! center .equals (Vector3 .Zero);

					if (hasCenter)
						this .translate (center);

					if (! rotation .equals (Rotation4 .Identity))
						this .rotate (rotation);

					if (! scale .equals (Vector3 .One))
					{
						if (! scaleOrientation .equals (Rotation4 .Identity))
						{
							this .rotate (scaleOrientation);
							this .scale (scale);
							this .rotate (scaleOrientation .copy () .inverse ());
						}
						else
							this .scale (scale);
					}

					if (hasCenter)
						this .translate (center .copy () .negate ());

					break;
				}
				case 16:
				{
					this [ 0] = arguments [ 0];
					this [ 1] = arguments [ 1];
					this [ 2] = arguments [ 2];
					this [ 3] = arguments [ 3];
					this [ 4] = arguments [ 4];
					this [ 5] = arguments [ 5];
					this [ 6] = arguments [ 6];
					this [ 7] = arguments [ 7];
					this [ 8] = arguments [ 8];
					this [ 9] = arguments [ 9];
					this [10] = arguments [10];
					this [11] = arguments [11];
					this [12] = arguments [12];
					this [13] = arguments [13];
					this [14] = arguments [14];
					this [15] = arguments [15];
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

			switch (arguments .length)
			{
				case 1:
				{
					translation .set (this [12], this [13], this [14]);
					break;
				}
				case 2:
				{
					this .factor (translation, rot, dummyScale, so);
					rotation .assign (Rotation4 .Matrix3 (rot));
					break;
				}
				case 3:
				{
					this .factor (translation, rot, scale, so);
					rotation .assign (Rotation4 .Matrix3 (rot));
					break;
				}
				case 4:
				{
					this .factor (translation, rot, scale, so);
					rotation .assign (Rotation4 .Matrix3 (rot));
					scaleOrientation .assign (Rotation4 .Matrix3 (so));
					break;
				}
				case 5:
				{
					var m = new Matrix4 ();

					m .set (center .copy () .negate ());
					m .multLeft (this);
					m .translate (center);

					m .get (translation, rotation, scale, scaleOrientation);
					break;
				}
			}
		},
		factor: function (translation, rotation, scale, scaleOrientation)
		{
			// (1) Get translation.
			translation .set (this [12], this [13], this [14]);

			// (2) Create 3x3 matrix.
			var a = this .submatrix;

			// (3) Compute det A. If negative, set sign = -1, else sign = 1
			var det      = a .determinant ();
			var det_sign = det < 0 ? -1 : 1;

			if (det_sign * det === 0)
				return false;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             // singular

			// (4) B = A * !A  (here !A means A transpose)
			var b = a .copy () .multRight (Matrix4 .transpose (a));
			var e = eigendecomposition (b);

			// Find min / max eigenvalues and do ratio test to determine singularity.

			scaleOrientation .set (e .vectors [0] [0], e .vectors [0] [1], e .vectors [0] [2],
			                       e .vectors [1] [0], e .vectors [1] [1], e .vectors [1] [2],
			                       e .vectors [2] [0], e .vectors [2] [1], e .vectors [2] [2]);

			// Compute s = sqrt(evalues), with sign. Set si = s-inverse

			scale .x = det_sign * Math .sqrt (e .values [0]);
			scale .y = det_sign * Math .sqrt (e .values [1]);
			scale .z = det_sign * Math .sqrt (e .values [2]);

			si [0] = 1 / scale .x;
			si [4] = 1 / scale .y;
			si [8] = 1 / scale .z;

			// (5) Compute U = !R ~S R A.
			rotation .assign (scaleOrientation .copy () .multRight (si) .multRight (Matrix3 .transpose (scaleOrientation)) .multRight (a));

			scaleOrientation .transpose ();
			return true;
		},
		determinant3: function ()
		{
			return this [0] * (this [5] * this [10] - this [6] * this [9]) -
			       this [1] * (this [4] * this [10] - this [6] * this [8]) +
			       this [2] * (this [4] * this [ 9] - this [5] * this [8]);
		},
		determinant: function ()
		{
			var
				a = this,
				b = a[10] * a[15],
				c = a[14] * a[11],
				d = a[ 6] * a[15],
				e = a[14] * a[ 7],
				f = a[ 6] * a[11],
				g = a[10] * a[ 7],
				h = a[ 2] * a[15],
				i = a[14] * a[ 3],
				j = a[ 2] * a[11],
				o = a[10] * a[ 3],
				r = a[ 2] * a[ 7],
				x = a[ 6] * a[ 3],
				H = b * a[5] + e * a[9] + f * a[13] - (c * a[5]) - (d * a[9]) - (g * a[13]),
				I = c * a[1] + h * a[9] + o * a[13] - (b * a[1]) - (i * a[9]) - (j * a[13]),
				J = d * a[1] + i * a[5] + r * a[13] - (e * a[1]) - (h * a[5]) - (x * a[13]),
				K = g * a[1] + j * a[5] + x * a[ 9] - (f * a[1]) - (o * a[5]) - (r * a[ 9]),
				B = a[0] * H + a[4] * I + a[8] * J + a[12] * K;

			return B;
		},
		transpose: function ()
		{
			var tmp;
			
			tmp = this [ 1]; this [ 1] = this [ 4]; this [ 1] = tmp;
			tmp = this [ 2]; this [ 2] = this [ 8]; this [ 2] = tmp;
			tmp = this [ 3]; this [ 3] = this [12]; this [ 3] = tmp;
			tmp = this [ 6]; this [ 6] = this [ 9]; this [ 6] = tmp;
			tmp = this [ 7]; this [ 7] = this [13]; this [ 7] = tmp;
			tmp = this [11]; this [11] = this [14]; this [11] = tmp;

			return this;
		},
		inverse: function ()
		{
			var
				a = this,
				b = a[10] * a[15],
				c = a[14] * a[11],
				d = a[ 6] * a[15],
				e = a[14] * a[ 7],
				f = a[ 6] * a[11],
				g = a[10] * a[ 7],
				h = a[ 2] * a[15],
				i = a[14] * a[ 3],
				j = a[ 2] * a[11],
				o = a[10] * a[ 3],
				r = a[ 2] * a[ 7],
				x = a[ 6] * a[ 3],
				t = a[ 8] * a[13],
				p = a[12] * a[ 9],
				v = a[ 4] * a[13],
				s = a[12] * a[ 5],
				y = a[ 4] * a[ 9],
				z = a[ 8] * a[ 5],
				A = a[ 0] * a[13],
				C = a[12] * a[ 1],
				D = a[ 0] * a[ 9],
				E = a[ 8] * a[ 1],
				F = a[ 0] * a[ 5],
				G = a[ 4] * a[ 1],
				H = b * a[5] + e * a[9] + f * a[13] - ((c * a[5]) + (d * a[9]) + (g * a[13])),
				I = c * a[1] + h * a[9] + o * a[13] - ((b * a[1]) + (i * a[9]) + (j * a[13])),
				J = d * a[1] + i * a[5] + r * a[13] - ((e * a[1]) + (h * a[5]) + (x * a[13])),
				K = g * a[1] + j * a[5] + x * a[ 9] - ((f * a[1]) + (o * a[5]) + (r * a[ 9])),
				B = a[0] * H + a[4] * I + a[8] * J + a[12] * K;

			if (B == 0)
				throw Error ("Matrix4 .inverse: determinant is 0.");

			B = 1 / B;

			this .set (B * H,
			           B * I,
			           B * J,
			           B * K,
			           B * (c * a[ 4] + d * a[ 8] + g * a[12] - (b * a[ 4]) - (e * a[ 8]) - (f * a[12])),
			           B * (b * a[ 0] + i * a[ 8] + j * a[12] - (c * a[ 0]) - (h * a[ 8]) - (o * a[12])),
			           B * (e * a[ 0] + h * a[ 4] + x * a[12] - (d * a[ 0]) - (i * a[ 4]) - (r * a[12])),
			           B * (f * a[ 0] + o * a[ 4] + r * a[ 8] - (g * a[ 0]) - (j * a[ 4]) - (x * a[ 8])),
			           B * (t * a[ 7] + s * a[11] + y * a[15] - (p * a[ 7]) - (v * a[11]) - (z * a[15])),
			           B * (p * a[ 3] + A * a[11] + E * a[15] - (t * a[ 3]) - (C * a[11]) - (D * a[15])),
			           B * (v * a[ 3] + C * a[ 7] + F * a[15] - (s * a[ 3]) - (A * a[ 7]) - (G * a[15])),
			           B * (z * a[ 3] + D * a[ 7] + G * a[11] - (y * a[ 3]) - (E * a[ 7]) - (F * a[11])),
			           B * (v * a[10] + z * a[14] + p * a[ 6] - (y * a[14]) - (t * a[ 6]) - (s * a[10])),
			           B * (D * a[14] + t * a[ 2] + C * a[10] - (A * a[10]) - (E * a[14]) - (p * a[ 2])),
			           B * (A * a[ 6] + G * a[14] + s * a[ 2] - (F * a[14]) - (v * a [2]) - (C * a[ 6])),
			           B * (F * a[10] + y * a[ 2] + E * a[ 6] - (D * a[ 6]) - (G * a[10]) - (z * a[ 2])));

			return this;
		},
		multLeft: function (matrix)
		{
			var a = this, b = matrix;

			this .set (a [0] * b [ 0] + a [4] * b [ 1] + a [ 8] * b [ 2] + a [12] * b [ 3],
				        a [1] * b [ 0] + a [5] * b [ 1] + a [ 9] * b [ 2] + a [13] * b [ 3],
				        a [2] * b [ 0] + a [6] * b [ 1] + a [10] * b [ 2] + a [14] * b [ 3],
				        a [3] * b [ 0] + a [7] * b [ 1] + a [11] * b [ 2] + a [15] * b [ 3],
				        a [0] * b [ 4] + a [4] * b [ 5] + a [ 8] * b [ 6] + a [12] * b [ 7],
				        a [1] * b [ 4] + a [5] * b [ 5] + a [ 9] * b [ 6] + a [13] * b [ 7],
				        a [2] * b [ 4] + a [6] * b [ 5] + a [10] * b [ 6] + a [14] * b [ 7],
				        a [3] * b [ 4] + a [7] * b [ 5] + a [11] * b [ 6] + a [15] * b [ 7],
				        a [0] * b [ 8] + a [4] * b [ 9] + a [ 8] * b [10] + a [12] * b [11],
				        a [1] * b [ 8] + a [5] * b [ 9] + a [ 9] * b [10] + a [13] * b [11],
				        a [2] * b [ 8] + a [6] * b [ 9] + a [10] * b [10] + a [14] * b [11],
				        a [3] * b [ 8] + a [7] * b [ 9] + a [11] * b [10] + a [15] * b [11],
				        a [0] * b [12] + a [4] * b [13] + a [ 8] * b [14] + a [12] * b [15],
				        a [1] * b [12] + a [5] * b [13] + a [ 9] * b [14] + a [13] * b [15],
				        a [2] * b [12] + a [6] * b [13] + a [10] * b [14] + a [14] * b [15],
				        a [3] * b [12] + a [7] * b [13] + a [11] * b [14] + a [15] * b [15]);

			return this;
		},
		multRight: function (matrix)
		{
			var a = this, b = matrix;

			this .set (a[ 0] * b [0] + a [ 1] * b [4] + a [ 2] * b [ 8] + a [ 3] * b [12],
				        a[ 0] * b [1] + a [ 1] * b [5] + a [ 2] * b [ 9] + a [ 3] * b [13],
				        a[ 0] * b [2] + a [ 1] * b [6] + a [ 2] * b [10] + a [ 3] * b [14],
				        a[ 0] * b [3] + a [ 1] * b [7] + a [ 2] * b [11] + a [ 3] * b [15],
				        a[ 4] * b [0] + a [ 5] * b [4] + a [ 6] * b [ 8] + a [ 7] * b [12],
				        a[ 4] * b [1] + a [ 5] * b [5] + a [ 6] * b [ 9] + a [ 7] * b [13],
				        a[ 4] * b [2] + a [ 5] * b [6] + a [ 6] * b [10] + a [ 7] * b [14],
				        a[ 4] * b [3] + a [ 5] * b [7] + a [ 6] * b [11] + a [ 7] * b [15],
				        a[ 8] * b [0] + a [ 9] * b [4] + a [10] * b [ 8] + a [11] * b [12],
				        a[ 8] * b [1] + a [ 9] * b [5] + a [10] * b [ 9] + a [11] * b [13],
				        a[ 8] * b [2] + a [ 9] * b [6] + a [10] * b [10] + a [11] * b [14],
				        a[ 8] * b [3] + a [ 9] * b [7] + a [10] * b [11] + a [11] * b [15],
				        a[12] * b [0] + a [13] * b [4] + a [14] * b [ 8] + a [15] * b [12],
				        a[12] * b [1] + a [13] * b [5] + a [14] * b [ 9] + a [15] * b [13],
				        a[12] * b [2] + a [13] * b [6] + a [14] * b [10] + a [15] * b [14],
				        a[12] * b [3] + a [13] * b [7] + a [14] * b [11] + a [15] * b [15]);

			return this;
		},
		multVecMatrix: function (vector)
		{
			if (vector instanceof Vector3)
			{
				var w = vector .x * this [3] + vector .y * this [7] + vector .z * this [11] + this [15];

				return vector .set ((vector .x * this [0] + vector .y * this [4] + vector .z * this [ 8] + this [12]) / w,
				                    (vector .x * this [1] + vector .y * this [5] + vector .z * this [ 9] + this [13]) / w,
				                    (vector .x * this [2] + vector .y * this [6] + vector .z * this [10] + this [14]) / w);
			}

			return vector .set (vector .x * this [0] + vector .y * this [4] + vector .z * this [ 8] + vector .w * this [12],
			                    vector .x * this [1] + vector .y * this [5] + vector .z * this [ 9] + vector .w * this [13],
			                    vector .x * this [2] + vector .y * this [6] + vector .z * this [10] + vector .w * this [14],
			                    vector .x * this [3] + vector .y * this [7] + vector .z * this [11] + vector .w * this [15]);
		},
		multMatrixVec: function (vector)
		{
			if (vector instanceof Vector3)
			{
				var w = vector .x * this [12] + vector .y * this [13] + vector .z * this [14] + this [15];

				return vector .set ((vector .x * this [0] + vector .y * this [1] + vector .z * this [ 2] + this [ 3]) / w,
				                    (vector .x * this [4] + vector .y * this [5] + vector .z * this [ 6] + this [ 7]) / w,
				                    (vector .x * this [8] + vector .y * this [9] + vector .z * this [10] + this [11]) / w);
			}

			return vector .set (vector .x * this [ 0] + vector .y * this [ 1] + vector .z * this [ 2] + vector .w * this [ 3],
			                    vector .x * this [ 4] + vector .y * this [ 5] + vector .z * this [ 6] + vector .w * this [ 7],
			                    vector .x * this [ 8] + vector .y * this [ 9] + vector .z * this [10] + vector .w * this [11],
			                    vector .x * this [12] + vector .y * this [13] + vector .z * this [14] + vector .w * this [15]);
		},
		multDirMatrix: function (vector)
		{
			return vector .set (vector .x * this [0] + vector .y * this [4] + vector .z * this [ 8],
			                    vector .x * this [1] + vector .y * this [5] + vector .z * this [ 9],
			                    vector .x * this [2] + vector .y * this [6] + vector .z * this [10]);
		},
		multMatrixDir: function (vector)
		{
			return vector .set (vector .x * this [0] + vector .y * this [1] + vector .z * this [ 2],
			                    vector .x * this [4] + vector .y * this [5] + vector .z * this [ 6],
			                    vector .x * this [8] + vector .y * this [9] + vector .z * this [10]);
		},
		identity: function ()
		{
			this [ 0] = 1; this [ 1] = 0; this [ 2] = 0; this [ 3] = 0;
			this [ 4] = 0; this [ 5] = 1; this [ 6] = 0; this [ 7] = 0;
			this [ 8] = 0; this [ 9] = 0; this [10] = 1; this [11] = 0;
			this [12] = 0; this [13] = 0; this [14] = 0; this [15] = 1;
		},
		translate: function (t)
		{
			this [12] += this [ 0] * t.x + this [ 4] * t.y + this [ 8] * t.z;
			this [13] += this [ 1] * t.x + this [ 5] * t.y + this [ 9] * t.z;
			this [14] += this [ 2] * t.x + this [ 6] * t.y + this [10] * t.z;
		},
		rotate: function (rotation)
		{
			this .multLeft (Matrix4 .Quaternion (rotation .value));
		},
		scale: function (scale)
		{
			this [ 0] *= scale .x;
			this [ 4] *= scale .y;
			this [ 8] *= scale .z;

			this [ 1] *= scale .x;
			this [ 5] *= scale .y;
			this [ 9] *= scale .z;

			this [ 2] *= scale .x;
			this [ 6] *= scale .y;
			this [10] *= scale .z;
		},
		toString: function ()
		{
			return this [ 0] + " " + this [ 1] + " " + this [ 2] + " " + this [ 3] + " " +
			       this [ 4] + " " + this [ 5] + " " + this [ 6] + " " + this [ 7] + " " +
			       this [ 8] + " " + this [ 9] + " " + this [10] + " " + this [11] + " " +
			       this [12] + " " + this [13] + " " + this [14] + " " + this [15]
		},
	};

	Object .defineProperty (Matrix4 .prototype, "x",
	{
		get: function () { return new Vector3 (this [ 0], this [ 1], this [ 2]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix4 .prototype, "y",
	{
		get: function () { return new Vector3 (this [ 4], this [ 5], this [ 6]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix4 .prototype, "z",
	{
		get: function () { return new Vector3 (this [ 8], this [ 9], this [10]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix4 .prototype, "origin",
	{
		get: function () { return new Vector3 (this [12], this [13], this [14]); },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix4 .prototype, "submatrix",
	{
		get: function ()
		{
			return new Matrix3 (this [ 0], this [ 1], this [ 2],
			                    this [ 4], this [ 5], this [ 6],
			                    this [ 8], this [ 9], this [10]);
		},
		enumerable: false,
		configurable: false
	});

	$.extend (Matrix4,
	{
		Identity: new Matrix4 (),
		Rotation: function (rotation)
		{
			return Matrix4 .Quaternion (rotation .value);
		},
		Quaternion: function (quaternion)
		{
			var
				x = quaternion .x,
				y = quaternion .y,
				z = quaternion .z,
				w = quaternion .w,
				A = y * y,
				B = z * z,
				C = x * y,
				D = z * w,
				E = z * x,
				F = y * w,
				G = x * x,
				H = y * z,
				I = x * w;

			return new Matrix4 (1 - 2 * (A + B),     2 * (C + D),     2 * (E - F), 0,
					                  2 * (C - D), 1 - 2 * (B + G),     2 * (H + I), 0,
					                  2 * (E + F),     2 * (H - I), 1 - 2 * (A + G), 0,
				                               0,               0,               0, 1);
		},
		Matrix3: function (matrix)
		{
			return new Matrix4 (matrix [0], matrix [1], matrix [2], 0,
			                    matrix [3], matrix [4], matrix [5], 0,
			                    matrix [6], matrix [7], matrix [8], 0,
			                    0, 0, 0, 1);
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

	return Matrix4;
});
