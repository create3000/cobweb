
define (function ()
{
"use strict";

	var
		extents1 = { min: 0, max: 0 },
		extents2 = { min: 0, max: 0 };

	/**
	 *  Class to represent the Separating Axis Theorem.
	 */
	function SAT () { }

	SAT .prototype =
	{
		///  Returns true if the object defined by @a points1 and the object defined by @a points2 are separated, otherwise
		///  false.  You must provide suitable axes for this test to operate on.  This test only gives reasonable result for
		///  convex objects.  For 2d objects it is sufficient to use the normal vectors of the edges as axes.  For 3d
		///  objects, the axes are the normal vectors of the faces of each object and the cross product of each edge from one
		///  object with each edge from the other object.  It is not needed to provide normalized axes.
		isSeparated (axes, points1, points2)
		{
			// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection
	
			for (var i = 0, length = axes .length; i < length; ++ i)
			{
				var axis = axes [i];

				project (points1, axis, extents1);
				project (points2, axis, extents2);
	
				if (overlaps (extents1 .min, extents1 .max, extents2 .min, extents2 .max))
					continue;
	
				return true;
			}
	
			return false;
		}
	};

	///  Projects @a points to @a axis and returns the minimum and maximum bounds.
	function project (points, axis, extents)
	{
		extents .min = Number .POSITIVE_INFINITY;
		extents .max = Number .NEGATIVE_INFINITY;

		for (var i = 0, length = points .length; i < length; ++ i)
		{
			var point = points [i];

			// Just dot it to get the min and max along this axis.
			// NOTE: the axis must be normalized to get accurate projections to calculate the MTV, but if it is only needed to
			// know whether it overlaps, every axis can be used.

			var dotVal = point .dot (axis);

			if (dotVal < min)
				extents .min = dotVal;

			if (dotVal > max)
				extents .max = dotVal;
		}
	}

	///  Returns true if both ranges overlap, otherwise false.
	function overlaps (min1, max1, min2, max2)
	{
		return is_between (min2, min1, max1) || is_between (min1, min2, max2);
	}

	///  Returns true if @a value is between @a lowerBound and @a upperBound, otherwise false.
	function is_between (value, lowerBound, upperBound)
	{
		return lowerBound <= value && value <= upperBound;
	}

	return SAT;
});
