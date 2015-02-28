
define ([
	"jquery",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DAppearanceChildNode, 
          X3DConstants)
{
	function X3DShaderNode (browser, executionContext)
	{
		X3DAppearanceChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DShaderNode);
	}

	X3DShaderNode .prototype = $.extend (new X3DAppearanceChildNode (),
	{
		constructor: X3DShaderNode,
	});

	return X3DShaderNode;
});

