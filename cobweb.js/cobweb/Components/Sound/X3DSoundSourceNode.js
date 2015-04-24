
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Time/X3DTimeDependentNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode,
          X3DTimeDependentNode,
          X3DConstants)
{
	function X3DSoundSourceNode (browser, executionContext)
	{
		X3DChildNode         .call (this, browser, executionContext);
		X3DTimeDependentNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DSoundSourceNode);
	}

	X3DSoundSourceNode .prototype = $.extend (Object .create (X3DTimeDependentNode .prototype),
	{
		constructor: X3DSoundSourceNode,
	});

	return X3DSoundSourceNode;
});

