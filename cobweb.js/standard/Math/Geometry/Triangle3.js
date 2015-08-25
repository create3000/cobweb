
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	var
	   A = new Vector3 (0, 0, 0),
	   B = new Vector3 (0, 0, 0),
	   C = new Vector3 (0, 0, 0);

	return {
	   area: function (a, b, c)
	   {
	      return A .assign (v2) .subtract (v1) .cross (B .assign (v3) .subtract (v1)) .abs () / 2;
	   },
		normal: function (v1, v2, v3)
		{
			var
				x1 = v3 .x - v2 .x,
				y1 = v3 .y - v2 .y,
				z1 = v3 .z - v2 .z,
				x2 = v1 .x - v2 .x,
				y2 = v1 .y - v2 .y,
				z2 = v1 .z - v2 .z;

			var normal = new Vector3 (y1 * z2 - z1 * y2,
			                          z1 * x2 - x1 * z2,
			                          x1 * y2 - y1 * x2);

			return normal .normalize ();
		},
		quadNormal: function (v1, v2, v3, v4)
		{
			var
				x1 = v3 .x - v1 .x,
				y1 = v3 .y - v1 .y,
				z1 = v3 .z - v1 .z,
				x2 = v4 .x - v2 .x,
				y2 = v4 .y - v2 .y,
				z2 = v4 .z - v2 .z;

			var normal = new Vector3 (y1 * z2 - z1 * y2,
			                          z1 * x2 - x1 * z2,
			                          x1 * y2 - y1 * x2);

			return normal .normalize ();
		},
		isPointInTriangle: function (a, b, c, point)
		{
		   // https://en.wikipedia.org/wiki/Barycentric_coordinate_system

		   var det = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);

		   var u = ((b.y - c.y) * (point .x - c.x) + (c.x - b.x) * (point .y - c.y)) / det;

		   if (u < 0 || u > 1)
		      return false;

		   var v = ((c.y - a.y) * (point .x - c.x) + (a.x - c.x) * (point .y - c.y)) / det;

		   if (v < 0 || v > 1)
		      return false;

		   var t = 1 - u - v;

		   if (t < 0 || t > 1)
		      return false;
		   
			return true;
		},
	};
});
