
define ("cobweb/Components/Scripting/X3DScriptNode",
[
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DUrlObject, 
          X3DConstants)
{
"use strict";

	function X3DScriptNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);
		X3DUrlObject .call (this, executionContext);

		this .addType (X3DConstants .X3DScriptNode);
	}

	X3DScriptNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: X3DScriptNode,
	});

	return X3DScriptNode;
});


