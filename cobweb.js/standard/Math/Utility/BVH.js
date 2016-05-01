
define ([
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Algorithms/QuickSort",
],
function (Vector3,
          Plane3,
          QuickSort)
{
"use strict";

	var
		size   = new Vector3 (0, 0, 0),
		vertex = new Vector3 (0, 0, 0),
		v0     = new Vector3 (0, 0, 0),
		v1     = new Vector3 (0, 0, 0),
		v2     = new Vector3 (0, 0, 0),
		uvt    = { u: 0, v: 0, t: 0 };

	// Box normals for bbox / line intersection.
	var boxNormals = [
		new Vector3 (0,  0,  1), // front
		new Vector3 (0,  0, -1), // back
		new Vector3 (0,  1,  0), // top
		new Vector3 (0, -1,  0), // bottom
		new Vector3 (1,  0,  0)  // right
		// left: We do not have to test for left.
	];

	function SortComparator (tree, axis)
	{
		function compare (a, b)
		{
			var
				vertices = compare .vertices;
				axis     = compare .axis;

			return Math .min (vertices [a + axis], vertices [a + 4 + axis], vertices [a + 8 + axis]) <
			       Math .min (vertices [b + axis], vertices [b + 4 + axis], vertices [b + 8 + axis]);
		}

		compare .vertices = tree .vertices;
		compare .axis     = axis;

		return compare;
	}

	function Triangle (tree, triangle)
	{
		this .vertices = tree .vertices;
		this .normals  = tree .normals;
		this .i4       = triangle * 12;
		this .i3       = triangle * 9;
	}

	Triangle .prototype =
	{
		getIntersections: function (line, points, normals)
		{
			var
				vertices = this .vertices,
				normals  = this .normals,
				i4       = this .i4,
				i3       = this .i3;

			v0 .x = vertices [i4 + 0]; v0 .y = vertices [i4 + 1]; v0 .z = vertices [i4 +  2];
			v1 .x = vertices [i4 + 4]; v1 .y = vertices [i4 + 5]; v1 .z = vertices [i4 +  6];
			v2 .x = vertices [i4 + 8]; v2 .y = vertices [i4 + 9]; v2 .z = vertices [i4 + 10];

			if (line .intersectsTriangle (v0, v1, v2, uvt))
			{
				// Get barycentric coordinates.

				var
					u = uvt .u,
					v = uvt .v,
					t = 1 - u - v;

				// Determine vectors for X3DPointingDeviceSensors.

				var point = new Vector3 (t * vertices [i4 + 0] + u * vertices [i4 + 4] + v * vertices [i4 +  8],
				                         t * vertices [i4 + 1] + u * vertices [i4 + 5] + v * vertices [i4 +  9],
				                         t * vertices [i4 + 2] + u * vertices [i4 + 6] + v * vertices [i4 + 10]);


				points .push (point);

				var normal = new Vector3 (t * normals [i3 + 0] + u * normals [i3 + 3] + v * normals [i3 + 6],
				                          t * normals [i3 + 1] + u * normals [i3 + 4] + v * normals [i3 + 7],
				                          t * normals [i3 + 2] + u * normals [i3 + 5] + v * normals [i3 + 8]);

				normals .push (normal);
			}
		},
	};

	function Node (tree, triangles, first, size)
	{

		this .tree         = tree;
		this .min          = new Vector3 (0, 0, 0);
		this .max          = new Vector3 (0, 0, 0);
		this .planes       = [ ];
		this .intersection = new Vector3 (0, 0, 0);

		var
			vertices = tree .vertices,
			min      = this .min,
			max      = this .max,
			last     = first + size,
			t        = triangles [first] * 12;

		// Calculate bbox

		min .set (vertices [t], vertices [t + 1], vertices [t + 2]);
		max .assign (min);

		for (var i = first; i < last; ++ i)
		{
			t = triangles [i] * 12;

			v0 .set (vertices [t + 0], vertices [t + 1], vertices [t + 2]);
			v1 .set (vertices [t + 4], vertices [t + 5], vertices [t + 6]);
			v2 .set (vertices [t + 8], vertices [t + 9], vertices [t + 10]);

			min .min (v0, v1, v2);
			max .max (v0, v1, v2);
		}

		for (var i = 0; i < 5; ++ i)
			this .planes [i] = new Plane3 (i % 2 ? min : max, boxNormals [i]);

		// Sort and split array

		if (size > 2)
		{
			// Sort array

			tree .sorter .compare .axis = this .getLongestAxis (min, max);
			tree .sorter .sort (first, last);

			// Split array

			var leftSize = size >>> 1;
		}
		else
			var leftSize = 1;

		// Split array

		var rightSize = size - leftSize;

		// Construct left and right node

		if (leftSize > 1)
			this .left = new Node (tree, triangles, first, leftSize);
		else
			this .left = new Triangle (tree, triangles [first]);

		if (rightSize > 1)
			this .right = new Node (tree, triangles, first + leftSize, rightSize);
		else
			this .right = new Triangle (tree, triangles [first + leftSize]);
	}

	Node .prototype = {
		getIntersections: function (line, points, normals)
		{
			if (this .intersectsBBox (line))
			{
				this .left  .getIntersections (line, points, normals);
				this .right .getIntersections (line, points, normals);
			}
		},
		intersectsBBox: function (line)
		{
			var
				planes       = this .planes,
				min          = this .min,
				max          = this .max,
				minX         = min .x,
				maxX         = max .x,
				maxZ         = max .x,
				minY         = min .y,
				maxY         = max .y,
				minZ         = min .z,
				maxZ         = max .z,
				intersection = this .intersection;

		   // front
			if (planes [0] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .y >= minY && intersection .y <= maxY)
					return true;
			}

			// back
			if (planes [1] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .y >= minY && intersection .y <= maxY)
					return true;
			}

			// top
			if (planes [2] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .z >= minZ && intersection .z <= maxZ)
					return true;
			}

			// bottom
			if (planes [3] .intersectsLine (line, intersection))
			{
				if (intersection .x >= minX && intersection .x <= maxX &&
				    intersection .z >= minZ && intersection .z <= maxZ)
					return true;
			}

			// right
			if (planes [4] .intersectsLine (line, intersection))
			{
				if (intersection .y >= minY && intersection .y <= maxY &&
				    intersection .z >= minZ && intersection .z <= maxZ)
					return true;
			}

			return false;
		},
		getLongestAxis: function (min, max)
		{
			size .assign (max) .subtract (min);
	
			if (size .x < size .y)
			{
				if (size .y < size .z)
					return 2;

				return 1;
			}
			else
			{
				if (size .x < size .z)
					return 2;

				return 0;
			}
		},
	};

	function BVH (vertices, normals)
	{
		this .vertices = vertices;
		this .normals  = normals;

		var numTriangles = vertices .length / 12;
	
		switch (numTriangles)
		{
			case 0:
				this .root = null;
				break;
			case 1:
			{
				this .root = new Triangle (this, 0);
				break;
			}
			default:
			{
				var triangles = [ ];

				for (var i = 0; i < numTriangles; ++ i)
					triangles .push (i);

				this .sorter = new QuickSort (triangles, SortComparator (this, 0));

				this .root = new Node (this, triangles, 0, numTriangles);
				break;
			}
		}
	}

	BVH .prototype =
	{
		constructor: BVH,
		getIntersections: function (line, points, normals)
		{
			points .length = 0;

			if (this .root)
			{
				this .root .getIntersections (line, points, normals);
				return points .length;
			}

			return 0;
		},
	};

	return BVH;
});
