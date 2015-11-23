
define ([
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"lib/poly2tri.js/dist/poly2tri.js",
],
function (Vector3,
          Matrix4,
          poly2tri)
{
"use strict";

	var
	   A = new Vector3 (0, 0, 0),
	   B = new Vector3 (0, 0, 0),
	   C = new Vector3 (0, 0, 0);

	function isCollinear (a, b, c)
	{
		var
			ab = A .assign (a) .subtract (b),
			cb = C .assign (c) .subtract (b);

		if (ab .abs () == 0)
			return true;

		if (cb .abs () == 0)
			return true;

		return Math .abs (ab .dot (cb)) >= 1;
	}

	return {
	   area: function (a, b, c)
	   {
	      return A .assign (v2) .subtract (v1) .cross (B .assign (v3) .subtract (v1)) .abs () / 2;
	   },
		normal: function (v1, v2, v3, normal)
		{
			var
				x1 = v3 .x - v2 .x,
				y1 = v3 .y - v2 .y,
				z1 = v3 .z - v2 .z,
				x2 = v1 .x - v2 .x,
				y2 = v1 .y - v2 .y,
				z2 = v1 .z - v2 .z;

			normal .set (y1 * z2 - z1 * y2,
			             z1 * x2 - x1 * z2,
			             x1 * y2 - y1 * x2);

			return normal .normalize ();
		},
		quadNormal: function (v1, v2, v3, v4, normal)
		{
			var
				x1 = v3 .x - v1 .x,
				y1 = v3 .y - v1 .y,
				z1 = v3 .z - v1 .z,
				x2 = v4 .x - v2 .x,
				y2 = v4 .y - v2 .y,
				z2 = v4 .z - v2 .z;

			normal .set (y1 * z2 - z1 * y2,
			             z1 * x2 - x1 * z2,
			             x1 * y2 - y1 * x2);

			return normal .normalize ();
		},
		removeCollinearPoints: function (polygon)
		{
			for (var i = 0, k = 0, length = polygon .length; i < length; ++ i)
			{
				var
					i0 = (i - 1 + length) % length,
					i1 = (i + 1) % length;

				if (isCollinear (polygon [i0], polygon [i], polygon [i1]))
					continue;

				polygon [k ++] = polygon [i];
		   }

			polygon .length = k;
		},
		triangulatePolygon: function (vertices, triangles)
		{
			try
			{
				// Filter collinear points.

				this .removeCollinearPoints (vertices);

				// Transform vertices to 2D space.

				var
					p0 = vertices [0],
					p1 = vertices [1];

				var
					zAxis = this .getPolygonNormal (vertices),
					xAxis = Vector3 .subtract (p1, p0),
					yAxis = Vector3 .cross (zAxis, xAxis);

				xAxis .normalize ();
				yAxis .normalize ();

				var matrix = new Matrix4 (xAxis .x, xAxis .y, xAxis .z, 0,
				                          yAxis .x, yAxis .y, yAxis .z, 0,
				                          zAxis .x, zAxis .y, zAxis .z, 0,
				                          p0 .x, p0 .y, p0 .z, 1);

				matrix .inverse ();

				var contour = [ ];

				for (var i = 0; i < vertices .length; ++ i)
					contour .push (matrix .multVecMatrix (vertices [i]));

				// Triangulate polygon.

				var
					context = new poly2tri .SweepContext (contour),
					ts      = context .triangulate () .getTriangles ();

				for (var i = 0; i < ts .length; ++ i)
					triangles .push (ts [i] .getPoint (0), ts [i] .getPoint (1), ts [i] .getPoint (2));
			}
			catch (error)
			{
				//console .log (error);
				this .triangulateConvexPolygon (vertices, triangles);
			}
		},
		triangulateConvexPolygon: function (vertices, triangles)
		{
			// Fallback: Very simple triangulation for convex polygons.
			for (var i = 1, length = vertices .length - 1; i < length; ++ i)
				triangles .push (vertices [0], vertices [i], vertices [i + 1]);
		},
		getPolygonNormal: function (vertices)
		{
			// Determine polygon normal.
			// We use Newell's method https://www.opengl.org/wiki/Calculating_a_Surface_Normal here:

			var
				normal = new Vector3 (0, 0, 0),
				next   = vertices [0];

			for (var i = 0, length = vertices .length; i < length; ++ i)
			{
				var
					current = next,
					next    = vertices [(i + 1) % length];

				normal .x += (current .y - next .y) * (current .z + next .z);
				normal .y += (current .z - next .z) * (current .x + next .x);
				normal .z += (current .x - next .x) * (current .y + next .y);
			}

			return normal .normalize ();
		},
	};
});
