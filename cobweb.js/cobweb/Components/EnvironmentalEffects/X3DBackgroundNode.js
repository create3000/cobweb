
define ([
	"jquery",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DBindableNode, 
          X3DConstants)
{
	function X3DBackgroundNode (browser, executionContext)
	{
		X3DBindableNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DBackgroundNode);
	}

	X3DBackgroundNode .prototype = $.extend (new X3DBindableNode (),
	{
		constructor: X3DBackgroundNode,
	});

	return X3DBackgroundNode;
});

