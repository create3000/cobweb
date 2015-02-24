
define ([
	"jquery",
	"cobweb/Components/Texturing/X3DTextureNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DTextureNode, 
          X3DConstants)
{
	function X3DTexture2DNode (browser, executionContext)
	{
		X3DTextureNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTexture2DNode);
	}

	X3DTexture2DNode .prototype = $.extend (new X3DTextureNode (),
	{
		constructor: X3DTexture2DNode,
	});

	return X3DTexture2DNode;
});

