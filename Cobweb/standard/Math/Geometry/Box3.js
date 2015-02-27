
define ([
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Numbers/Vector3",
],
function (Matrix4, Vector3)
{
	function Box3 (size, center)
	{
		switch (arguments .length)
		{
			case 0:
			{
				this .matrix = new Matrix4 (0.5, 0,   0,   0,
				                            0,   0.5, 0,   0,
				                            0,   0,   0.5, 0,
				                            0,   0,   0,   0);
				break;
			}
			case 1:
			{
				this .matrix = arguments [0];
				break;
			}
			case 3:
			{
				var min = arguments [0];
				var max = arguments [1];

				size   = max .subtract (min);
				center = max .add (min) .divide (2);

				// Proceed with next case:
			}
			case 2:
			{
				this .matrix = new Matrix4 (size .x / 2, 0, 0, 0,
				                            0, size .y / 2, 0, 0,
				                            0, 0, size .z / 2, 0,
				                            center .x, center .y, center .z, 1);
				break;
			}
		}
	}

	Box3 .prototype =
	{
		isEmpty: function ()
		{
			return this .matrix [15] === 0;
		},
		multBoxMatrix: function (matrix)
		{
			return new Box3 (this .matrix .multRight (matrix));
		},
		multMatrixBox: function (matrix)
		{
			return new Box3 (this .matrix .multLeft (matrix));
		},
		getAbsoluteExtents: function (min, max)
		{
			var x = this .matrix .x;
			var y = this .matrix .y;
			var z = this .matrix .z;

			var r1 = y .add (z);
			var r2 = z .subtract (y);

			var p1 =  x .add (r1);
			var p2 = r1 .subtract (x);
			var p3 = r2 .subtract (x);
			var p4 =  x .add (r2);

			var p5 = p3 .negate ();
			var p6 = p4 .negate ();
			var p7 = p1 .negate ();
			var p8 = p2 .negate ();

			min .assign (p1 .min (p2, p3, p4, p5, p6, p7, p8));
			max .assign (p1 .max (p2, p3, p4, p5, p6, p7, p8));
		},
		toString: function ()
		{
			return this .size + ", " + this .center;
		},
	};

	Object .defineProperty (Box3 .prototype, "size",
	{
		get: function ()
		{
			var
				min = new Vector3 (),
				max = new Vector3 ();
			
			this .getAbsoluteExtents (min, max);

			return max .subtract (min);
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Box3 .prototype, "center",
	{
		get: function ()
		{
			return this .matrix .origin;
		},
		enumerable: true,
		configurable: false
	});

	return Box3;
});
