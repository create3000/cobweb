
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DLayoutNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLayoutNode);
	}

	X3DLayoutNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DLayoutNode,
	});

	return X3DLayoutNode;
});

