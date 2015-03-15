
define ([
	"jquery",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
],
function ($,
          X3DCast,
          X3DConstants,
          Box3)
{
	function X3DBoundedObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DBoundedObject);
	}

	X3DBoundedObject .prototype =
	{
		constructor: X3DBoundedObject,
		initialize: function () { },
	};

	X3DBoundedObject .getBBox = function (nodes)
	{
		var bbox = new Box3 ();

		// Add bounding boxes

		for (var i = 0; i < nodes .length; ++ i)
		{
			var boundedObject = X3DCast (X3DConstants .X3DBoundedObject, nodes [i]);

			if (boundedObject)
			{
				if (!boundedObject .getBBox ())
					console .log (boundedObject .getTypeName ());
			
				bbox .add (boundedObject .getBBox ());
			}
		}

		return bbox;
	};

	return X3DBoundedObject;
});

