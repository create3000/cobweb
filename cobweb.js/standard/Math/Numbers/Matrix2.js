
define ([
	"jquery",
	"standard/Math/Algorithm"
],
function ($, Algorithm)
{
	function Matrix2 ()
	{
		if (arguments .length)
		{
			this [0] = arguments [0];
			this [1] = arguments [1];
			this [2] = arguments [2];
			this [3] = arguments [3];
		}
		else
			this .identity ();
	}

	Matrix2 .prototype =
	{
		constructor: Matrix2,
		order: 2,
		length: 4,
		copy: function ()
		{
			var copy = Object .create (Matrix2 .prototype);
			copy [0] = this [0];
			copy [1] = this [1];
			copy [2] = this [2];
			copy [3] = this [3];
			return copy;
		},
		assign: function (matrix)
		{
			this [0] = matrix [0];
			this [1] = matrix [1];
			this [2] = matrix [2];
			this [3] = matrix [3];
		},
		equals: function (matrix)
		{
			return this [0] === matrix [0] &&
			       this [1] === matrix [1] &&
			       this [2] === matrix [2] &&
			       this [3] === matrix [3];
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
					this .identity ();
					break;
				}
				case 4:
				{
					this [0] = arguments [0];
					this [1] = arguments [1];
					this [2] = arguments [2];
					this [3] = arguments [3];	
					break;
				}
			}
		},
		identity: function ()
		{
			this [0] = 1;
			this [1] = 0;
			this [2] = 0;
			this [3] = 1;	
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

	$.extend (Matrix2,
	{
		Identity: new Matrix2 (),
	});

	return Matrix2;
});
