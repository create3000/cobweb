
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
"use strict";

	function X3DNurbsControlCurveNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DNurbsControlCurveNode);
	}

	X3DNurbsControlCurveNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DNurbsControlCurveNode,
	});

	return X3DNurbsControlCurveNode;
});


