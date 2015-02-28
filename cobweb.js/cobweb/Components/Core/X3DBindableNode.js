
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DBindableNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DBindableNode);
	}

	X3DBindableNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DBindableNode,
	});

	return X3DBindableNode;
});

