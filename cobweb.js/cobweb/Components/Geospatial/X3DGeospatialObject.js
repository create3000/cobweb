
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Geospatial/Geospatial",
	"cobweb/Bits/X3DCast",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DConstants,
          Geospatial,
          X3DCast,
          Vector3,
          Matrix4)
{
"use strict";

	var
		vector = new Vector3 (0, 0, 0),
		result = new Vector3 (0, 0, 0),
		t      = new Vector3 (0, 0, 0),
		x      = new Vector3 (0, 0, 0),
		y      = new Vector3 (0, 0, 0),
		z      = new Vector3 (0, 0, 0);

	function X3DGeospatialObject (executionContext)
	{
		this .addType (X3DConstants .X3DGeospatialObject);

		this .radians = false;
		this .origin  = new Vector3 (0, 0, 0);
	}

	X3DGeospatialObject .prototype =
	{
		constructor: X3DGeospatialObject,
		originMatrix: new Matrix4 (),
		invOriginMatrix: new Matrix4 (),
		initialize: function ()
		{
			this .geoSystem_ .addInterest (this, "set_geoSystem__");
			this .geoOrigin_ .addInterest (this, "set_geoOrigin__");

			this .set_geoSystem__ ();
			this .set_geoOrigin__ ();
		},
		set_geoSystem__: function ()
		{
			this .coordinateSystem = Geospatial .getCoordinateSystem (this .geoSystem_);
			this .referenceFrame   = Geospatial .getReferenceFrame   (this .geoSystem_, this .radians);
			this .elevationFrame   = Geospatial .getElevationFrame   (this .geoSystem_, this .radians);
			this .standardOrder    = Geospatial .isStandardOrder     (this .geoSystem_);
		},
		set_geoOrigin__: function ()
		{
			if (this .geoOriginNode)
			{
				this .geoOriginNode .removeInterest (this, "set_origin__");
				this .geoOriginNode .removeInterest (this, "set_rotateYUp__");
				this .geoOriginNode .removeInterest (this, "addNodeEvent");
			}
		
			this .geoOriginNode = X3DCast (X3DConstants .GeoOrigin, this .geoOrigin_);
		
			if (this .geoOriginNode)
			{
				this .geoOriginNode .addInterest (this, "set_origin__");
				this .geoOriginNode .addInterest (this, "set_rotateYUp__");
				this .geoOriginNode .addInterest (this, "addNodeEvent");
			}
		
			this .set_origin__ ();
			this .set_rotateYUp__ ();
		},
		set_origin__: function ()
		{
			if (this .geoOriginNode)
				this .geoOriginNode .getOrigin (this .origin);
			else
				this .origin .set (0, 0, 0);

			this .set_originMatrix__ ();
		},
		set_originMatrix__: function ()
		{
			if (this .geoOriginNode)
			{
				// Position
				var t = this .origin;
		
				// Let's work out the orientation at that location in order
				// to maintain a view where +Y is in the direction of gravitional
				// up for that region of the planet's surface. This will be the
				// value of the rotation matrix for the transform.
			
				this .elevationFrame .normal (t, y);
		
				x .set (0, 0, 1) .cross (y);
		
				// Handle pole cases.
				if (x .equals (Vector3 .Zero))
					x .set (1, 0, 0);
			
				z .assign (x) .cross (y);
			
				x .normalize ();
				z .normalize ();
			
				this .originMatrix .set (x .x, x .y, x .z, 0,
				                         y .x, y .y, y .z, 0,
				                         z .x, z .y, z .z, 0,
				                         t .x, t .y, t .z, 1);

				this .invOriginMatrix .assign (this .originMatrix) .inverse ();
			}
		},
		set_rotateYUp__: function ()
		{
			if (this .geoOriginNode && this .geoOriginNode .rotateYUp_ .getValue ())
			{
				this .getCoord          = getCoordRotateYUp;
				this .getGeoCoord       = getGeoCoordRotateYUp;
				this .getGeoUpVector    = getGeoUpVectorRotateYUp;
				this .getLocationMatrix = getLocationMatrixRotateYUp;
			}
			else
			{
				this .getCoord          = getCoord;
				this .getGeoCoord       = getGeoCoord;
				this .getGeoUpVector    = getGeoUpVector;
				this .getLocationMatrix = getLocationMatrix;
			}
		},
		getReferenceFrame: function ()
		{
			return this .referenceFrame;
		},
		getStandardOrder: function ()
		{
			return this .standardOrder;
		},
		getCoord: getCoord,
		getGeoCoord: getGeoCoord,
		getElevation: function (point)
		{
			vector .assign (point) .add (this .origin);

			return this .elevationFrame .applyRadians (vector, result) .z;
		},
		getGeoUpVector: getGeoUpVector,
		getLocationMatrix: getLocationMatrix,
	};

	function getCoord (geoPoint, result)
	{
		return this .referenceFrame .convert (geoPoint, result) .subtract (this .origin);
	}

	function getCoordRotateYUp (geoPoint, result)
	{
		return this .invOriginMatrix .multVecMatrix (this .referenceFrame .convert (geoPoint, result));
	}

	function getGeoCoord (point, result)
	{
		return this .referenceFrame .apply (vector .assign (point) .add (this .origin), result);
	}

	function getGeoCoordRotateYUp (point, result)
	{
		return this .referenceFrame .apply (this .originMatrix .multVecMatrix (vector .assign (point)), result);
	}

	function getGeoUpVector (point, result)
	{
		return this .elevationFrame .normal (vector .assign (point) .add (this .origin), result);
	}

	function getGeoUpVectorRotateYUp (point, result)
	{
		return this .invOriginMatrix .multDirMatrix (this .elevationFrame .normal (this .originMatrix .multVecMatrix (vector .assign (point)), result));
	}

	function getStandardLocationMatrix (geoPoint, result)
	{
		// Position
		this .referenceFrame .convert (geoPoint, t);

		// Let's work out the orientation at that location in order
		// to maintain a view where +Y is in the direction of gravitional
		// up for that region of the planet's surface. This will be the
		// value of the rotation matrix for the transform.
	
		this .elevationFrame .normal (t, y);

		x .set (0, 0, 1) .cross (y);

		// Handle pole cases.
		if (x .equals (Vector3 .Zero))
			x .set (1, 0, 0);
	
		z .assign (x) .cross (y);
	
		x .normalize ();
		z .normalize ();
	
		return result .set (x .x, x .y, x .z, 0,
		                    y .x, y .y, y .z, 0,
		                    z .x, z .y, z .z, 0,
		                    t .x, t .y, t .z, 1);
	}

	function getLocationMatrix (geoPoint, result)
	{
		return getStandardLocationMatrix .call (this, geoPoint, result) .translate (this .origin);
	}

	function getLocationMatrixRotateYUp (geoPoint, result)
	{
		return getStandardLocationMatrix .call (this, geoPoint, result) .multRight (this .invOriginMatrix);
	}

	return X3DGeospatialObject;
});


