
define ([
	"jquery",
	"cobweb/Components/Time/X3DTimeDependentNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DTimeDependentNode, 
          X3DConstants)
{
	function X3DSoundSourceNode (browser, executionContext)
	{
		X3DTimeDependentNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DSoundSourceNode);
	}

	X3DSoundSourceNode .prototype = $.extend (new X3DTimeDependentNode (),
	{
		constructor: X3DSoundSourceNode,
	});

	return X3DSoundSourceNode;
});

