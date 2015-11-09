
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

	function X3DVertexAttributeNode (browser, executionContext)
	{
		X3DGeometricPropertyNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DVertexAttributeNode);
	}

	X3DVertexAttributeNode .prototype = $.extend (Object .create (X3DGeometricPropertyNode .prototype),
	{
		constructor: X3DVertexAttributeNode,
	});

	return X3DVertexAttributeNode;
});


