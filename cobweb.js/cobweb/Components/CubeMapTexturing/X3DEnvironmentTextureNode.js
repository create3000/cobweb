
define ([
	"jquery",
	"cobweb/Components/Texturing/X3DTextureNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DTextureNode, 
          X3DConstants)
{
	function X3DEnvironmentTextureNode (browser, executionContext)
	{
		X3DTextureNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DEnvironmentTextureNode);
	}

	X3DEnvironmentTextureNode .prototype = $.extend (new X3DTextureNode (),
	{
		constructor: X3DEnvironmentTextureNode,
	});

	return X3DEnvironmentTextureNode;
});

