
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DAppearanceChildNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DAppearanceChildNode);
	}

	X3DAppearanceChildNode .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DAppearanceChildNode,
	});

	return X3DAppearanceChildNode;
});

