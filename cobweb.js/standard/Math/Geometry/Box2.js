
define ([
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Numbers/Vector2",
],
function (Matrix3, Vector2)
{
"use strict";

	var
		x   = new Vector2 (0, 0),
		y   = new Vector2 (0, 0),
		min = new Vector2 (0, 0),
		max = new Vector2 (0, 0),
		p1  = new Vector2 (0, 0);

	function Box2 (size, center)
	{
		switch (arguments .length)
		{
			case 0:
			{
				this .matrix = new Matrix3 (0.5, 0,   0,
				                            0,   0.5, 0,
				                            0,   0,   0);
				return;
			}
			case 2:
			{
				this .matrix = new Matrix3 (size .x / 2, 0, 0,
				                            0, size .y / 2, 0,
				                            center .x, center .y, 1);
				return;
			}
			case 3:
			{
				var
					min = arguments [0],
					max = arguments [1],
					sx  = (max .x - min .x) / 2,
					sy  = (max .y - min .y) / 2,
					cx  = (max .x + min .x) / 2,
					cy  = (max .y + min .y) / 2;

				this .matrix = new Matrix3 (sx, 0,  0,
				                            0,  sy, 0,
				                            cx, cy, 1);
				return;
			}
		}
	}

	Box2 .prototype =
	{
		constructor: Box2,
		copy: function ()
		{
			var copy = Object .create (Box2 .prototype);
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
			m [0] = size .x / 2; m [1] = 0;           m [2] = 0;
			m [3] = 0;           m [4] = size .y / 2; m [5] = 0;
			m [6] = center .x;   m [7] = center .y;   m [8] = 1;
			return this;
		},
		set: function (size, center)
		{
			var m = this .matrix;
		
			switch (arguments .length)
			{
				case 0:
				{
					m [0] = 0.5; m [1] = 0;   m [2] = 0;
					m [3] = 0;   m [4] = 0.5; m [5] = 0;
					m [6] = 0;   m [7] = 0;   m [8] = 0;
					return this;
				}
				case 2:
				{
					m [0] = size .x / 2; m [1] = 0;           m [2] = 0;
					m [3] = 0;           m [4] = size .y / 2; m [5] = 0;
					m [6] = center .x;   m [7] = center .y;   m [8] = 1;
					return this;
				}
				case 3:
				{
					var
						min = arguments [0],
						max = arguments [1],
						sx  = (max .x - min .x) / 2,
						sy  = (max .y - min .y) / 2,
						cx  = (max .x + min .x) / 2,
						cy  = (max .y + min .y) / 2;

					m [0] = sx; m [1] = 0;  m [2] = 0;
					m [3] = 0;  m [4] = sy; m [5] = 0;
					m [6] = cx; m [7] = cy; m [8] = 1;
					return this;
				}
			}
		},
		setExtents: function (min, max)
		{
			var
				m  = this .matrix,
				sx = (max .x - min .x) / 2,
				sy = (max .y - min .y) / 2,
				cx = (max .x + min .x) / 2,
				cy = (max .y + min .y) / 2;

			m [0] = sx; m [1] = 0;  m [2] = 0;
			m [3] = 0;  m [4] = sy; m [5] = 0;
			m [6] = cx; m [7] = cy; m [8] = 1;
			return this;
		},
		isEmpty: function ()
		{
			return this .matrix [8] === 0;
		},
		add: function (box)
		{
			if (this .isEmpty ())
				return this .assign (box);

			if (box .isEmpty ())
				return this;

			var
				lhs_min = new Vector2 (0, 0),
				lhs_max = new Vector2 (0, 0),
				rhs_min = new Vector2 (0, 0),
				rhs_max = new Vector2 (0, 0);

			this .getExtents (lhs_min, lhs_max);
			box  .getExtents (rhs_min, rhs_max);

			return this .assign (new Box2 (lhs_min .min (rhs_min), lhs_max .max (rhs_max), true));
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

			x .set (m [0], m [1]);
			y .set (m [3], m [4]);

			p1 .assign (x) .add (y);

			var p2 = y .subtract (x);

			min .assign (p1) .min (p2);
			max .assign (p1) .max (p2);

			p1 .negate ();
			p2 .negate ();

			min .min (p1, p2);
			max .max (p1, p2);
		},
		intersectsPoint: function (point)
		{
			this .getExtents (min, max);

			return min .x <= point .x &&
			       max .x >= point .x &&
			       min .y <= point .y &&
			       max .y >= point .y;
		},
		toString: function ()
		{
			return this .size + ", " + this .center;
		},
	};

	Object .defineProperty (Box2 .prototype, "size",
	{
		get: function ()
		{
			var max = new Vector2 (0, 0);
			
			this .getAbsoluteExtents (min, max);

			return max .subtract (min);
		},
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (Box2 .prototype, "center",
	{
		get: function ()
		{
			return this .matrix .origin;
		},
		enumerable: true,
		configurable: false
	});

	return Box2;
});
