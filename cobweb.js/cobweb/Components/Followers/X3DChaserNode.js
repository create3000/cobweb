
define ([
	"jquery",
	"cobweb/Components/Followers/X3DFollowerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DFollowerNode, 
          X3DConstants)
{
	function X3DChaserNode (browser, executionContext)
	{
		X3DFollowerNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DChaserNode);
	}

	X3DChaserNode .prototype = $.extend (new X3DFollowerNode (),
	{
		constructor: X3DChaserNode,
	});

	return X3DChaserNode;
});

