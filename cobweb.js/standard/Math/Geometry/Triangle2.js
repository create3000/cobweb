
define (function ()
{
	return {
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
