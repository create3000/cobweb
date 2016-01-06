
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
"use strict";

	function X3DTriggerNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DTriggerNode);
	}

	X3DTriggerNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DTriggerNode,
	});

	return X3DTriggerNode;
});


