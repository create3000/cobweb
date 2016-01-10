
define ("cobweb/Components/CADGeometry/X3DProductStructureChildNode",
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

	function X3DProductStructureChildNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DProductStructureChildNode);
	}

	X3DProductStructureChildNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DProductStructureChildNode,
	});

	return X3DProductStructureChildNode;
});


