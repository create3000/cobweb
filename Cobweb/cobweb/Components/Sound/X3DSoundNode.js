
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DSoundNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DSoundNode);
	}

	X3DSoundNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DSoundNode,
	});

	return X3DSoundNode;
});

