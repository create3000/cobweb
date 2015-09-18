
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
	};
});
