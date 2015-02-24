
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DProductStructureChildNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DProductStructureChildNode);
	}

	X3DProductStructureChildNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DProductStructureChildNode,
	});

	return X3DProductStructureChildNode;
});

