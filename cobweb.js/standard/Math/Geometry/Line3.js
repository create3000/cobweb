
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{

	function Line3 (point, direction)
	{
		this .point     = point;
		this .direction = direction;
	}

	Line3 .prototype =
	{
		constructor: Line3,
		// Static vectors for line / triangle intersection.
		u: new Vector3 (0, 0, 0),
		pvec: new Vector3 (0, 0, 0),
		tvec: new Vector3 (0, 0, 0),
		copy: function ()
		{
			var copy = Object .create (Line3 .prototype);
			copy .point     = this .point .copy ();
			copy .direction = this .direction .copy ();
			return copy;
		},
		assign: function (line)
		{
			this .point     .assign (line .point);
			this .direction .assign (line .direction);
			return this;
		},
		multMatrixLine: function (matrix)
		{
			matrix .multMatrixVec (this .point);
			matrix .multMatrixDir (this .direction) .normalize ();
			return this;
		},
		multLineMatrix: function (matrix)
		{
			matrix .multVecMatrix (this .point);
			matrix .multDirMatrix (this .direction) .normalize ();
			return this;
		},
		getClosestPointToPoint: function (point)
		{
			var
				r = point .copy () .subtract (this .point),
				d = r .dot (this .direction);

			return r .assign (this .direction) .multiply (d) .add (this .point);
		},
		getClosestPointToLine: function (line, point)
		{
			var
				p1 = this .point,
				p2 = line .point,
				d1 = this .direction,
				d2 = line .direction;

			var t = Vector3 .dot (d1, d2);

			if (Math .abs (t) >= 1)
				return false;  // lines are parallel

			var u = this .u .assign (p2) .subtract (p1);

			t = (Vector3 .dot (u, d1) - t * Vector3 .dot (u, d2)) / (1 - t * t);

			point .assign (d1) .multiply (t) .add (p1);
			return true;
		},
		intersectsTriangle (A, B, C, uvt)
		{
			// Find vectors for two edges sharing vert0.
			var
				edge1 = B .subtract (A),
				edge2 = C .subtract (A);

			// Begin calculating determinant - also used to calculate U parameter.
			var pvec = this .pvec .assign (this .direction) .cross (edge2);

			// If determinant is near zero, ray lies in plane of triangle.
			var det = edge1 .dot (pvec);

			// Non culling intersection.

			if (det === 0)
				return false;

			var inv_det = 1 / det;

			// Calculate distance from vert0 to ray point.
			var tvec = this .tvec .assign (this .point) .subtract (A);

			// Calculate U parameter and test bounds.
			var u = tvec .dot (pvec) * inv_det;

			if (u < 0 || u > 1)
				return false;

			// Prepare to test V parameter.
			var qvec = tvec .cross (edge1);

			// Calculate V parameter and test bounds.
			var v = this .direction .dot (qvec) * inv_det;

			if (v < 0 || u + v > 1)
				return false;

			var t = edge2 .dot (qvec) * inv_det;

			uvt .x = u;
			uvt .y = v;
			uvt .z = t;

			return true;
		},
		toString: function ()
		{
			return this .point + ", " + this .direction;
		},
	};

	Line3 .Points = function (point1, point2)
	{
		var line = Object .create (Line3 .prototype);
		line .point     = point1;
		line .direction = Vector3 .subtract (point2, point1) .normalize ();
		return line;
	};

	return Line3;
});
