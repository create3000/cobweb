
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Geospatial/Geospatial",
],
function ($,
          X3DConstants,
          Geospatial)
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


