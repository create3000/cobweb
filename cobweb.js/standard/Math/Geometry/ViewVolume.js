
define ([
	"jquery",
	"standard/Math/Geometry/Line3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
],
function ($, Line3, Plane3, Triangle3, Vector3, Vector4, Matrix4)
{
	var
		p1     = new Vector3 (0, 0, 0),
		p2     = new Vector3 (0, 0, 0),
		p3     = new Vector3 (0, 0, 0),
		p4     = new Vector3 (0, 0, 0),
		p5     = new Vector3 (0, 0, 0),
		p6     = new Vector3 (0, 0, 0),
		near   = new Vector3 (0, 0, 0),
		far    = new Vector3 (0, 0, 0),
		matrix = new Matrix4 (),
		normal = new Vector3 (0, 0, 0),
		vin    = new Vector4 (0, 0, 0, 0);

	function ViewVolume (projectionMatrix, viewport, scissor)
	{
		this .viewport = new Vector4 (0, 0, 0, 0);
		this .scissor  = new Vector4 (0, 0, 0, 0);
		
		this .planes = [
			new Plane3 (Vector3 .Zero, Vector3 .Zero),  // front
			new Plane3 (Vector3 .Zero, Vector3 .Zero),  // left
			new Plane3 (Vector3 .Zero, Vector3 .Zero),  // right
			new Plane3 (Vector3 .Zero, Vector3 .Zero),  // top
			new Plane3 (Vector3 .Zero, Vector3 .Zero),  // bottom
			new Plane3 (Vector3 .Zero, Vector3 .Zero),  // back
		];
	   
	   this .set (projectionMatrix, viewport, scissor);
	}

	ViewVolume .prototype =
	{
		constructor: ViewVolume,
		set: function (projectionMatrix, viewport, scissor)
		{
			try
			{
				this .viewport .assign (viewport);
				this .scissor  .assign (scissor);

				var
					x1 = scissor [0],
					x2 = scissor [0] + scissor [2],
					y1 = scissor [1],
					y2 = scissor [1] + scissor [3];

				matrix .assign (projectionMatrix) .inverse ();

				ViewVolume .unProjectPointMatrix (x1, y2, 1, matrix, viewport, p1),
				ViewVolume .unProjectPointMatrix (x1, y1, 1, matrix, viewport, p2),
				ViewVolume .unProjectPointMatrix (x1, y1, 0, matrix, viewport, p3),
				ViewVolume .unProjectPointMatrix (x2, y1, 0, matrix, viewport, p4),
				ViewVolume .unProjectPointMatrix (x2, y2, 0, matrix, viewport, p5),
				ViewVolume .unProjectPointMatrix (x2, y2, 1, matrix, viewport, p6);

				this .planes [0] .set (p4, Triangle3 .normal (p5, p4, p3, normal));  // front
				this .planes [1] .set (p2, Triangle3 .normal (p3, p2, p1, normal));  // left
				this .planes [2] .set (p5, Triangle3 .normal (p4, p5, p6, normal));  // right
				this .planes [3] .set (p6, Triangle3 .normal (p1, p6, p5, normal));  // top
				this .planes [4] .set (p3, Triangle3 .normal (p2, p3, p4, normal));  // bottom
				this .planes [5] .set (p1, Triangle3 .normal (p6, p1, p2, normal));  // back

				this .valid = true;
			}
			catch (error)
			{
				this .valid = false;
				console .log (error);
			}
		},
		getViewport: function ()
		{
			return this .viewport;
		},
		getScissor: function ()
		{
			return this .scissor;
		},
		intersectsSphere: function (radius, center)
		{
			var planes = this .planes;
		
			if (planes [0] .distance (center) + radius < 0)
				return false;

			if (planes [1] .distance (center) + radius < 0)
				return false;

			if (planes [2] .distance (center) + radius < 0)
				return false;

			if (planes [3] .distance (center) + radius < 0)
				return false;

			if (planes [4] .distance (center) + radius < 0)
				return false;

			if (planes [5] .distance (center) + radius < 0)
				return false;

			return true;
		},
	};

	$.extend (ViewVolume,
	{
		unProjectPoint: function (winx, winy, winz, modelview, projection, viewport, point)
		{
			var matrix = Matrix4 .multRight (modelview, projection) .inverse ();

			return this .unProjectPointMatrix (winx, winy, winz, matrix, viewport, point);
		},
		unProjectPointMatrix: function (winx, winy, winz, matrix, viewport, point)
		{
			// Transformation of normalized coordinates between -1 and 1
			vin .set ((winx - viewport [0]) / viewport [2] * 2 - 1,
			          (winy - viewport [1]) / viewport [3] * 2 - 1,
			          2 * winz - 1,
			          1);

			//Objects coordinates
			matrix .multVecMatrix (vin);

			if (vin .w === 0)
				throw Error ("Couldn't unproject point: divisor is 0.");

			var d = 1 / vin .w;

			return point .set (vin .x * d, vin .y * d, vin .z * d);
		},
		unProjectLine: function (winx, winy, modelview, projection, viewport)
		{
			matrix .assign (modelview) .multRight (projection) .inverse ();

			ViewVolume .unProjectPointMatrix (winx, winy, 0.0, matrix, viewport, near);
			ViewVolume .unProjectPointMatrix (winx, winy, 0.9, matrix, viewport, far);

			return new Line3 .Points (near, far);
		},
		projectPoint: function (point, modelview, projection, viewport, vout)
		{
			vin .set (point .x, point .y, point .z, 1);

			projection .multVecMatrix (modelview .multVecMatrix (vin));

			if (vin .w === 0)
				throw Error ("Couldn't project point: divisor is 0.");

			var d = 1 / (2 * vin .w);

			return vout .set ((vin .x * d + 0.5) * viewport [2] + viewport [0],
			                  (vin .y * d + 0.5) * viewport [3] + viewport [1],
			                  (vin .z * d + 0.5));
		},
		projectLine: function (line, modelview, projection, viewport)
		{
			ViewVolume .projectPoint (line .point, modelview, projection, viewport, near);
			ViewVolume .projectPoint (Vector3 .multiply (line .direction, 1e9) .add (line .point), modelview, projection, viewport, far);

			near .z = 0;
			far  .z = 0;

			return new Line3 .Points (near, far);
		},
	});

	return ViewVolume;
});
