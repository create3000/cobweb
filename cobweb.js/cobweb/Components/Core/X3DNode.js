
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DBaseNode,
          X3DConstants)
{
	function X3DNode (browser, executionContext)
	{
		X3DBaseNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DNode);
	}

	X3DNode .prototype = $.extend (new X3DBaseNode (),
	{
		constructor: X3DNode,
		getCurrentLayer: function ()
		{
			return this .getBrowser () .getLayers () [0];
		},
	});

	return X3DNode;
});
