
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DLightNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DLightNode);
	}

	X3DLightNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DLightNode,
	});

	return X3DLightNode;
});

