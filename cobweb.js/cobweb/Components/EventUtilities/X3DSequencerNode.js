
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DSequencerNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DSequencerNode);
	}

	X3DSequencerNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DSequencerNode,
	});

	return X3DSequencerNode;
});

