
define ([
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function (Vector3,
          Matrix4)
{
"use strict";

	var
		normal    = new Vector3 (0, 0, 0),
		point     = new Vector3 (0, 0, 0),
		invMatrix = new Matrix4 ();

	function Plane3 (point, normal)
	{
		this .normal             = normal .copy ();
		this .distanceFromOrigin = normal .dot (point);
	}

	Plane3 .prototype =
	{
		constructor: Plane3,
		copy: function ()
		{
			var copy = Object .create (Plane3 .prototype);
			copy .normal             = this .normal .copy ();
			copy .distanceFromOrigin = this .distanceFromOrigin;
			return copy;
		},
		assign: function (plane)
		{
			this .normal .assign (plane .normal);
			this .distanceFromOrigin = plane .distanceFromOrigin;
			return this;
		},
		set: function (point, normal)
		{
			this .normal .assign (normal);
			this .distanceFromOrigin = normal .dot (point);	   
			return this;
		},
		multRight: function (matrix)
		//throw
		{
			// Taken from Inventor:
		
			// Find the point on the plane along the normal from the origin
			point .assign (this .normal) .multiply (this .distanceFromOrigin);
		
			// Transform the plane normal by the matrix
			// to get the new normal. Use the inverse transpose
			// of the matrix so that normals are not scaled incorrectly.
			// n' = n * !~m = ~m * n
			invMatrix .assign (matrix) .inverse ();
			invMatrix .multMatrixDir (normal .assign (this .normal)) .normalize ();
		
			// Transform the point by the matrix
			matrix .multVecMatrix (point);
		
			// The new distance is the projected distance of the vector to the
			// transformed point onto the (unit) transformed normal. This is
			// just a dot product.
			this .normal .assign (normal);
			this .distanceFromOrigin = normal .dot (point);

			return this;
		},
		multLeft: function (matrix)
		//throw
		{
			// Taken from Inventor:
		
			// Find the point on the plane along the normal from the origin
			point .assign (this .normal) .multiply (this .distanceFromOrigin);
		
			// Transform the plane normal by the matrix
			// to get the new normal. Use the inverse transpose
			// of the matrix so that normals are not scaled incorrectly.
			// n' = !~m * n = n * ~m
			invMatrix .assign (matrix) .inverse ();
			invMatrix .multDirMatrix (normal .assign (this .normal)) .normalize ();
		
			// Transform the point by the matrix
			matrix .multḾatrixVec (point);
		
			// The new distance is the projected distance of the vector to the
			// transformed point onto the (unit) transformed normal. This is
			// just a dot product.
			this .normal .assign (normal);
			this .distanceFromOrigin = normal .dot (point);

			return this;
		},
		getDistanceToPoint: function (point)
		{
			return Vector3 .dot (point, this .normal) - this .distanceFromOrigin;
		},
		intersectsLine: function (line, intersection)
		{
			var
				point     = line .point,
				direction = line .direction;
		
			// Check if the line is parallel to the plane.
			var theta = direction .dot (this .normal);

			// Plane and line are parallel.
			if (theta === 0)
				return false;

			// Plane and line are not parallel. The intersection point can be calculated now.
			var t = (this .distanceFromOrigin - this .normal .dot (point)) / theta;

			intersection .x = point .x + direction .x * t;
			intersection .y = point .y + direction .y * t;
			intersection .z = point .z + direction .z * t;

			return true;
		},
		toString: function ()
		{
			return this .normal .toString () + " " + this .distanceFromOrigin;
		},
	};

	return Plane3;
});
