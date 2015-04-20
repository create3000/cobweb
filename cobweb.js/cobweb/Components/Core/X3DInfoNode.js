
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DInfoNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DInfoNode);
	}

	X3DInfoNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DInfoNode,
	});

	return X3DInfoNode;
});

