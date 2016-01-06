
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
"use strict";

	function X3DNBodyCollidableNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);
		X3DBoundedObject .call (this, executionContext);

		this .addType (X3DConstants .X3DNBodyCollidableNode);
	}

	X3DNBodyCollidableNode .prototype = $.extend (Object .create (X3DChildNode .prototype),new X3DBoundedObject (),
	{
		constructor: X3DNBodyCollidableNode,
	});

	return X3DNBodyCollidableNode;
});


