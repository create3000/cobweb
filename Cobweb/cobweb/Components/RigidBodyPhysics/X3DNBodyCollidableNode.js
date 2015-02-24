
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DBoundedObject, 
          X3DConstants)
{
	function X3DNBodyCollidableNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);
		X3DBoundedObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DNBodyCollidableNode);
	}

	X3DNBodyCollidableNode .prototype = $.extend (new X3DChildNode (),new X3DBoundedObject (),
	{
		constructor: X3DNBodyCollidableNode,
	});

	return X3DNBodyCollidableNode;
});

