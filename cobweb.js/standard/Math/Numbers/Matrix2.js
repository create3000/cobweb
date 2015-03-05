
define ([
	"standard/Math/Algorithm"
],
function (Algorithm)
{
	function Matrix2 (m00, m01,
	                  m10, m11)
	{
		if (arguments .length)
		{
			for (var i = 0; i < this .length; ++ i)
				this [i] = arguments [i];
		}
		else
			this .set ();
	}

	Matrix2 .prototype =
	{
		constructor: Matrix2,
		order: 2,
		length: 4,
		copy: function ()
		{
			return new Matrix3 (this [0], this [1],
			                    this [2], this [3]);
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
		set1: function (r, c, value)
		{
			this [r * this .order + c] = value;
		},
		get1: function (r, c)
		{
			return this [r * this .order + c];
		},
		set: function ()
		{
			switch (arguments .length)
			{
				case 0:
				{
					for (var r = 0; r < this .order; ++ r)
						for (var c = 0; c < this .order; ++ c)
							this [r * this .order + c] = r === c ? 1 : 0;
					break;
				}
				case 4:
				{
					for (var i = 0; i < this .length; ++ i)
						this [i] = arguments [i];

					break;
				}
			}
		},
		toString: function ()
		{
			return this [0] + " " + this [1] + " " +
			       this [2] + " " + this [3]
		},
	};

	Object .defineProperty (Matrix2 .prototype, "x",
	{
		get: function () { return this [0]; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix2 .prototype, "origin",
	{
		get: function () { return nthis [2]; },
		enumerable: false,
		configurable: false
	});

	Object .defineProperty (Matrix2 .prototype, "submatrix",
	{
		get: function () { return this .value [0]; },
		enumerable: false,
		configurable: false
	});

	return Matrix2;
});
