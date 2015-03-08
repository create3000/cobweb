
define ([
	"jquery",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
],
function ($, Vector3, Vector4)
{
	function ViewVolume () { }

	$.extend (ViewVolume,
	{
		unProjectPoint: function (winx, winy, winz, modelview, projection, viewport)
		{
			// Transformation of normalized coordinates between -1 and 1
			var vin = new Vector4 ((winx - viewport [0]) / viewport [2] * 2 - 1,
			                       (winy - viewport [1]) / viewport [3] * 2 - 1,
			                       2 * winz - 1,
			                       1);

			var matrix = modelview .copy () .multRight (projection) .inverse ();

			//Objects coordinates
			vin = matrix .multVecMatrix (vin);

			if (vin .w === 0)
				throw Error ("Couldn't unproject point: divisor is 0.");

			var d = 1 / vin .w;

			return new Vector3 (vin .x * d, vin .y * d, vin .z * d);
		},
		unProjectLine: function (winx, winy, modelview, projection, viewport)
		{
			var near   = ViewVolume .unProjectPoint (winx, winy, 0.0, modelview, projection, viewport);
			var far    = ViewVolume .unProjectPoint (winx, winy, 0.9, modelview, projection, viewport);

			return new Line3 (near, far, { points: true });
		},
		projectPoint: function (point, modelview, projection, viewport)
		{
			var vin    = new Vector4 (point .x, point .y, point .z, 1);
			var matrix = modelview .copy () .multRight (projection);

			vin = matrix .multVecMatrix (vin);

			if (vin .w === 0)
				throw Error ("Couldn't project point: divisor is 0.");

			var d = 1 / vin .w;

			return new Vector3 ((vin .x * d / 2 + 0.5) * viewport [2] + viewport [0],
			                    (vin .y * d / 2 + 0.5) * viewport [3] + viewport [1],
			                    (1 + vin .z * d) / 2);
		},
		projectLine: function (line, modelview, projection, viewport)
		{
			var point1 = ViewVolume .projectPoint (line .point (), modelview, projection, viewport);
			var point2 = ViewVolume .projectPoint (Vector3 .add (line .point (), Vector3 .multiply (line .direction (), 1e9)), modelview, projection, viewport);

			point1 .z = 0;
			point2 .z = 0;

			return new Line3 (point1, point2, { points: true });
		},
	});

	return ViewVolume;
});
