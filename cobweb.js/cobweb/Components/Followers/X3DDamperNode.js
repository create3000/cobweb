
define ([
	"jquery",
	"cobweb/Components/Followers/X3DFollowerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DFollowerNode, 
          X3DConstants)
{
	function X3DDamperNode (browser, executionContext)
	{
		X3DFollowerNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DDamperNode);
	}

	X3DDamperNode .prototype = $.extend (new X3DFollowerNode (),
	{
		constructor: X3DDamperNode,
	});

	return X3DDamperNode;
});

