
define ([
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Numbers/Vector3",
],
function (Matrix4, Vector3)
{
	var
	   min = new Vector3 (0, 0, 0),
	   max = new Vector3 (0, 0, 0),
	   x   = new Vector3 (0, 0, 0),
	   y   = new Vector3 (0, 0, 0),
	   z   = new Vector3 (0, 0, 0);

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
				return;
			}
			case 2:
			{
				this .matrix = new Matrix4 (size .x / 2, 0, 0, 0,
				                            0, size .y / 2, 0, 0,
				                            0, 0, size .z / 2, 0,
				                            center .x, center .y, center .z, 1);
				return;
			}
			case 3:
			{
				var
					min = arguments [0],
					max = arguments [1],
					sx  = (max .x - min .x) / 2,
					sy  = (max .y - min .y) / 2,
					sz  = (max .z - min .z) / 2,
					cx  = (max .x + min .x) / 2,
					cy  = (max .y + min .y) / 2,
					cz  = (max .z + min .z) / 2;

				this .matrix = new Matrix4 (sx, 0,  0,  0,
				                            0,  sy, 0,  0,
				                            0,  0,  sz, 0,
				                            cx, cy, cz, 1);
				return;
			}
		}
	}

	Box3 .prototype =
	{
		constructor: Box3,
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
		set: function (size, center)
		{
			var m = this .matrix;
			m [ 0] = size .x / 2; m [ 1] = 0;           m [ 2] = 0;           m [ 3] = 0;
			m [ 4] = 0;           m [ 5] = size .y / 2; m [ 6] = 0;           m [ 7] = 0;
			m [ 8] = 0;           m [ 9] = 0;           m [10] = size .z / 2; m [11] = 0;
			m [12] = center .x;   m [13] = center .y;   m [14] = center .z;   m [15] = 1;
			return this;
		},
		setExtents: function (min, max)
		{
			var
				m  = this .matrix,
				sx = (max .x - min .x) / 2,
				sy = (max .y - min .y) / 2,
				sz = (max .z - min .z) / 2,
				cx = (max .x + min .x) / 2,
				cy = (max .y + min .y) / 2,
				cz = (max .z + min .z) / 2;

			m [ 0] = sx; m [ 1] = 0;  m [ 2] = 0;  m [ 3] = 0;
			m [ 4] = 0;  m [ 5] = sy; m [ 6] = 0;  m [ 7] = 0;
			m [ 8] = 0;  m [ 9] = 0;  m [10] = sz; m [11] = 0;
			m [12] = cx; m [13] = cy; m [14] = cz; m [15] = 1;
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
				lhs_min = new Vector3 (0, 0, 0),
				lhs_max = new Vector3 (0, 0, 0),
				rhs_min = new Vector3 (0, 0, 0),
				rhs_max = new Vector3 (0, 0, 0);

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
		   var m = this .matrix;

			x .set (m [0], m [1], m [2]);
			y .set (m [4], m [5], m [6]);
			z .set (m [8], m [9], m [10]);

			var
				r1 = Vector3 .add (y, z),
				r2 = z .subtract (y);

			var
				p1 = Vector3 .add (x, r1),
				p4 = Vector3 .add (x, r2),
				p2 = r1 .subtract (x),
				p3 = r2 .subtract (x);

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
			var max = new Vector3 (0, 0, 0);
			
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
