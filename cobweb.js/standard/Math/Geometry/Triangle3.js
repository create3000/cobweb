
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	return {
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
	};
});
