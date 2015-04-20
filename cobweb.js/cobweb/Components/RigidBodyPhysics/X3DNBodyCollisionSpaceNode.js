
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DBoundedObject, 
          X3DConstants)
{
	function X3DNBodyCollisionSpaceNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);
		X3DBoundedObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DNBodyCollisionSpaceNode);
	}

	X3DNBodyCollisionSpaceNode .prototype = $.extend (Object .create (X3DNode .prototype),new X3DBoundedObject (),
	{
		constructor: X3DNBodyCollisionSpaceNode,
	});

	return X3DNBodyCollisionSpaceNode;
});

