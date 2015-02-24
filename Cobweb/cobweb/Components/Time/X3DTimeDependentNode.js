
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DTimeDependentNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTimeDependentNode);
	}

	X3DTimeDependentNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DTimeDependentNode,
	});

	return X3DTimeDependentNode;
});

