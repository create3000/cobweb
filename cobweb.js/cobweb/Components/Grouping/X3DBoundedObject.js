
define ([
	"jquery",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Box3",
],
function ($,
          X3DCast,
          X3DConstants,
          Vector3,
          Box3)
{
"use strict";

	function X3DBoundedObject (executionContext)
	{
		this .addType (X3DConstants .X3DBoundedObject);

		this .childBBox = new Box3 ();
	}

	X3DBoundedObject .prototype =
	{
		constructor: X3DBoundedObject,
		defaultBBoxSize: new Vector3 (-1, -1, -1),
		initialize: function () { },
		getBBox: function (nodes, bbox)
		{
			bbox .set ();
	
			// Add bounding boxes
	
			for (var i = 0, length = nodes .length; i < length; ++ i)
			{
				var boundedObject = X3DCast (X3DConstants .X3DBoundedObject, nodes [i]);
	
				if (boundedObject)
					bbox .add (boundedObject .getBBox (this .childBBox));
			}
	
			return bbox;
		},
	};


	return X3DBoundedObject;
});


