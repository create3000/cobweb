
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DChildNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DChildNode);
	}

	X3DChildNode .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DChildNode,
	});

	return X3DChildNode;
});

