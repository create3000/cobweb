
define ([
	"jquery",
	"cobweb/Components/Followers/X3DFollowerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DFollowerNode, 
          X3DConstants)
{
"use strict";

	function X3DChaserNode (browser, executionContext)
	{
		X3DFollowerNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DChaserNode);
	}

	X3DChaserNode .prototype = $.extend (Object .create (X3DFollowerNode .prototype),
	{
		constructor: X3DChaserNode,
	});

	return X3DChaserNode;
});


