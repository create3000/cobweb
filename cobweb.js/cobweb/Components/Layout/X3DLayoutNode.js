
define ("cobweb/Components/Layout/X3DLayoutNode",
[
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode,
          X3DConstants)
{
"use strict";

	function X3DLayoutNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DLayoutNode);
	}

	X3DLayoutNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DLayoutNode,
	});

	return X3DLayoutNode;
});


