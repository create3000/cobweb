
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometryNode, 
          X3DConstants)
{
"use strict";

	function X3DParametricGeometryNode (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .X3DParametricGeometryNode);
	}

	X3DParametricGeometryNode .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: X3DParametricGeometryNode,
	});

	return X3DParametricGeometryNode;
});


