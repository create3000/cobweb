
define ([
	"jquery",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DAppearanceChildNode, 
          X3DConstants)
{
	function X3DTextureNode (browser, executionContext)
	{
		X3DAppearanceChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTextureNode);
	}

	X3DTextureNode .prototype = $.extend (new X3DAppearanceChildNode (),
	{
		constructor: X3DTextureNode,
	});

	return X3DTextureNode;
});

