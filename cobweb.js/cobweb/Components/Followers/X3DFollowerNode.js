
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DFollowerNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DFollowerNode);
	}

	X3DFollowerNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DFollowerNode,
	});

	return X3DFollowerNode;
});

