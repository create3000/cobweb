
define ([
	"jquery",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
],
function ($, Plane3, Triangle3, Vector3, Vector4)
{
	function ViewVolume (projectionMatrix, viewport, scissor)
	{
		try
		{
			var x1 = scissor [0];
			var x2 = scissor [0] + scissor [2];
			var y1 = scissor [1];
			var y2 = scissor [1] + scissor [3];

			var matrix = projectionMatrix .copy () .inverse ();

			this .viewport = viewport;
			this .scissor  = scissor;

			var p1 = ViewVolume .unProjectPointMatrix (x1, y2, 1, matrix, viewport);
			var p2 = ViewVolume .unProjectPointMatrix (x1, y1, 1, matrix, viewport);
			var p3 = ViewVolume .unProjectPointMatrix (x1, y1, 0, matrix, viewport);
			var p4 = ViewVolume .unProjectPointMatrix (x2, y1, 0, matrix, viewport);
			var p5 = ViewVolume .unProjectPointMatrix (x2, y2, 0, matrix, viewport);
			var p6 = ViewVolume .unProjectPointMatrix (x2, y2, 1, matrix, viewport);

			this .planes = [ ];
			this .planes .push (new Plane3 (p4, Triangle3 .normal (p5, p4, p3)));  // front
			this .planes .push (new Plane3 (p1, Triangle3 .normal (p6, p1, p2)));  // back
			this .planes .push (new Plane3 (p2, Triangle3 .normal (p3, p2, p1)));  // left
			this .planes .push (new Plane3 (p5, Triangle3 .normal (p4, p5, p6)));  // right
			this .planes .push (new Plane3 (p6, Triangle3 .normal (p1, p6, p5)));  // top
			this .planes .push (new Plane3 (p3, Triangle3 .normal (p2, p3, p4)));  // bottom

			this .valid = true;
		}
		catch (error)
		{
			this .valid    = false;
			this .viewport = new Vector3 ();
			this .scissor  = new Vector3 ();
			console .log (error .message);
		}
	}

	ViewVolume .prototype =
	{
		getViewport: function ()
		{
			return this .viewport;
		},
		getScissor: function ()
		{
			return this .scissor;
		},
		intersects: function (size, center)
		{
			if (this .valid)
			{
				var nradius = size .abs () / 2;

				for (var i = 0; i < this .planes .length; ++ i)
				{
					if (this .planes [i] .distance (center) + nradius < 0)
						return false;
				}
			}

			return true;
		},
	};

	$.extend (ViewVolume,
	{
		unProjectPoint: function (winx, winy, winz, modelview, projection, viewport)
		{
			var matrix = modelview .copy () .multRight (projection) .inverse ();

			return this .unProjectPointMatrix (winx, winy, winz, matrix, viewport);
		},
		unProjectPointMatrix: function (winx, winy, winz, matrix, viewport)
		{
			// Transformation of normalized coordinates between -1 and 1
			var vin = new Vector4 ((winx - viewport [0]) / viewport [2] * 2 - 1,
			                       (winy - viewport [1]) / viewport [3] * 2 - 1,
			                       2 * winz - 1,
			                       1);

			//Objects coordinates
			vin = matrix .multVecMatrix (vin);

			if (vin .w === 0)
				throw Error ("Couldn't unproject point: divisor is 0.");

			var d = 1 / vin .w;

			return new Vector3 (vin .x * d, vin .y * d, vin .z * d);
		},
		unProjectLine: function (winx, winy, modelview, projection, viewport)
		{
			var matrix = modelview .copy () .multRight (projection);
			var near   = ViewVolume .unProjectPointMatrix (winx, winy, 0.0, matrix, viewport);
			var far    = ViewVolume .unProjectPointMatrix (winx, winy, 0.9, matrix, viewport);

			return new Line3 (near, far, { points: true });
		},
		projectPoint: function (point, modelview, projection, viewport)
		{
			var matrix = modelview .copy () .multRight (projection);

			return this .projectPointMatrix (point, matrix, viewport);
		},
		projectPointMatrix: function (point, matrix, viewport)
		{
			var vin = new Vector4 (point .x, point .y, point .z, 1);

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
			var matrix = modelview .copy () .multRight (projection);
			var point1 = ViewVolume .projectPointMatrix (line .point (), matrix, viewport);
			var point2 = ViewVolume .projectPointMatrix (Vector3 .add (line .point (), Vector3 .multiply (line .direction (), 1e9)), matrix, viewport);

			point1 .z = 0;
			point2 .z = 0;

			return new Line3 (point1, point2, { points: true });
		},
	});

	return ViewVolume;
});
