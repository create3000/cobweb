
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometricPropertyNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DGeometricPropertyNode, 
          X3DConstants,
          Triangle3,
          Vector3)
{
"use strict";

	function X3DCoordinateNode (browser, executionContext)
	{
		X3DGeometricPropertyNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DCoordinateNode);
	}

	X3DCoordinateNode .prototype = $.extend (Object .create (X3DGeometricPropertyNode .prototype),
	{
		constructor: X3DCoordinateNode,
		isEmpty: function ()
		{
			return this .point_ .length == 0;
		},
		getSize: function ()
		{
			return this .point_ .length;
		},
		getPoint: function (index)
		{
			// The index cannot be less than 0.

			if (index < this .point_ .length)
				return this .point_ [index] .getValue ();

			return new Vector3 (0, 0, 0);
		},
		getNormal: function (index1, index2, index3)
		{
			// The index[1,2,3] cannot be less than 0.

			var
				point  = this .point_ .getValue (),
				length = point .length;

			if (index1 < length && index2 < length && index3 < length)
				return Triangle3 .normal (point [index1] .getValue (),
				                          point [index2] .getValue (),
				                          point [index3] .getValue (),
				                          new Vector3 (0, 0, 0));

			return new Vector3 (0, 0, 0);
		},
		getQuadNormal: function (index1, index2, index3, index4)
		{
			// The index[1,2,3,4] cannot be less than 0.

			var
				point  = this .point_ .getValue (),
				length = point .length;

			if (index1 < length && index2 < length && index3 < length && index4 < length)
				return Triangle3 .quadNormal (point [index1] .getValue (),
				                              point [index2] .getValue (),
				                              point [index3] .getValue (),
				                              point [index4] .getValue (),
				                              new Vector3 (0, 0, 0));

			return new Vector3 (0, 0, 0);
		},
	});

	return X3DCoordinateNode;
});


