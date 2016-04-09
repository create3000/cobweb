
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
	"standard/Geospatial/ReferenceEllipsoids",
	"standard/Geospatial/Geodetic",
	"standard/Geospatial/UniversalTransverseMercator",
],
function ($,
          X3DConstants,
          ReferenceEllipsoids,
          Geodedic,
          UniversalTransverseMercator)
{
"use strict";

	function X3DGeospatialObject (executionContext)
	{
		this .addType (X3DConstants .X3DGeospatialObject);
	}

	X3DGeospatialObject .prototype =
	{
		constructor: X3DGeospatialObject,
		initialize: function () { },
	};

	return X3DGeospatialObject;
});


