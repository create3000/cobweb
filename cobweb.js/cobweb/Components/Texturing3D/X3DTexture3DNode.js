
define ([
	"jquery",
	"cobweb/Components/Texturing/X3DTextureNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DTextureNode, 
          X3DConstants)
{
"use strict";

	function X3DTexture3DNode (executionContext)
	{
		X3DTextureNode .call (this, executionContext);

		this .addType (X3DConstants .X3DTexture3DNode);
	}

	X3DTexture3DNode .prototype = $.extend (Object .create (X3DTextureNode .prototype),
	{
		constructor: X3DTexture3DNode,
	});

	return X3DTexture3DNode;
});


