
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometricPropertyNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometricPropertyNode, 
          X3DConstants)
{
"use strict";

	function X3DColorNode (executionContext)
	{
		X3DGeometricPropertyNode .call (this, executionContext);

		this .addType (X3DConstants .X3DColorNode);

		this .color = this .color_ .getValue ();
	}

	X3DColorNode .prototype = $.extend (Object .create (X3DGeometricPropertyNode .prototype),
	{
		constructor: X3DColorNode,
		get1Color: function (index)
		{
			if (index >= 0 && index < this .color .length)
				return this .color [index] .getValue ();

			if (this .color .length)
				return this .color [this .color .length - 1] .getValue ();

			return this .getWhite ();
		},
	});

	return X3DColorNode;
});


