
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Geospatial/Geospatial",
	"cobweb/Bits/X3DCast",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DConstants,
          Geospatial,
          X3DCast,
          Vector3)
{
"use strict";

	var
		vector = new Vector3 (0, 0, 0),
		result = new Vector3 (0, 0, 0),
		p      = new Vector3 (0, 0, 0),
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
				this .geoOriginNode .removeInterest (this, "addNodeEvent");
			}
		
			this .geoOriginNode = X3DCast (X3DConstants .GeoOrigin, this .geoOrigin_);
		
			if (this .geoOriginNode)
			{
				this .geoOriginNode .addInterest (this, "set_origin__");
				this .geoOriginNode .addInterest (this, "addNodeEvent");
			}
		
			this .set_origin__ ();
		},
		set_origin__: function ()
		{
			if (this .geoOriginNode)
				this .geoOriginNode .getOrigin (this .origin);
			else
				this .origin .set (0, 0, 0);
		},
		getReferenceFrame: function ()
		{
			return this .referenceFrame;
		},
		getStandardOrder: function ()
		{
			return this .standardOrder;
		},
		getGeoCoord: function (point, result)
		{
			return this .referenceFrame .apply (vector .assign (point) .add (this .origin), result);
		},
		getElevation: function (point)
		{
			vector .assign (point) .add (this .origin);

			return this .elevationFrame .applyRadians (vector, result) .z;
		},
		getUpVector: function (point, result)
		{
			return this .elevationFrame .normal (vector .assign (point) .add (this .origin), result);
		},
		getCoord: function (geoPoint, result)
		{
			return this .referenceFrame .convert (geoPoint, result) .subtract (this .origin);
		},
		getLocationMatrix: function (geoPoint, result)
		{
			// Position
			this .referenceFrame .convert (geoPoint, p);
			t .assign (p) .subtract (this .origin);

			// Let's work out the orientation at that location in order
			// to maintain a view where +Y is in the direction of gravitional
			// up for that region of the planet's surface. This will be the
			// value of the rotation matrix for the transform.
		
			this .elevationFrame .normal (p, y);

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
		},
	};

	return X3DGeospatialObject;
});


