
define ([
	"jquery",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DConstants)
{
	function X3DGeospatialObject (browser, executionContext)
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

