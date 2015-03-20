
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

				size   = Vector3 .subtract (max, min);
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
		copy: function ()
		{
			var copy = Object .create (Box3 .prototype);
			copy .matrix = this .matrix .copy ();
			return copy;
		},
		assign: function (box)
		{
			this .matrix .assign (box .matrix);
			return this;
		},
		isEmpty: function ()
		{
			return this .matrix [15] === 0;
		},
		add: function (box)
		{
			if (this .isEmpty ())
				return this .assign (box);

			if (box .isEmpty ())
				return this;

			var
				lhs_min = new Vector3 (),
				lhs_max = new Vector3 (),
				rhs_min = new Vector3 (),
				rhs_max = new Vector3 ();

			this .getExtents (lhs_min, lhs_max);
			box  .getExtents (rhs_min, rhs_max);

			return this .assign (new Box3 (lhs_min .min (rhs_min), lhs_max .max (rhs_max), true));
		},
		multLeft: function (matrix)
		{
			this .matrix .multLeft (matrix);
			return this;
		},
		multRight: function (matrix)
		{
			this .matrix .multRight (matrix);
			return this;
		},
		getExtents: function (min, max)
		{
			this .getAbsoluteExtents (min, max);

			min .add (this .center);
			max .add (this .center);
		},
		getAbsoluteExtents: function (min, max)
		{
			var x = this .matrix .x;
			var y = this .matrix .y;
			var z = this .matrix .z;

			var r1 = Vector3 .add (y, z);
			var r2 = z .subtract (y);

			var p1 = Vector3 .add (x, r1);
			var p4 = Vector3 .add (x, r2);
			var p2 = r1 .subtract (x);
			var p3 = r2 .subtract (x);

			min .assign (p1);
			max .assign (p2);

			min .min (p2, p3, p4);
			max .max (p2, p3, p4);

			p3 .negate ();
			p4 .negate ();
			p1 .negate ();
			p2 .negate ();

			min .min (p1, p2, p3, p4);
			max .max (p1, p2, p3, p4);
		},
		intersectsPoint: function (point)
		{
			var
				min = new Vector3 (),
				max = new Vector3 ();

			this .getExtents (min, max);

			return min .x <= point .x &&
			       max .x >= point .x &&
			       min .y <= point .y &&
			       max .y >= point .y &&
			       min .z <= point .z &&
			       max .z >= point .z;
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
