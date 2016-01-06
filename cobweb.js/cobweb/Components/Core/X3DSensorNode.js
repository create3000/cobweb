
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

	function X3DSensorNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DSensorNode);
	}

	X3DSensorNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DSensorNode,
	});

	return X3DSensorNode;
});


