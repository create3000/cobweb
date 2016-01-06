
define ([
	"jquery",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGroupingNode, 
          X3DConstants)
{
"use strict";

	function X3DViewportNode (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .X3DViewportNode);
	}

	X3DViewportNode .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: X3DViewportNode,
	});

	return X3DViewportNode;
});


