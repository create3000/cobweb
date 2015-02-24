
define ([
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
	function X3DScriptNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);
		X3DUrlObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DScriptNode);
	}

	X3DScriptNode .prototype = $.extend (new X3DChildNode (),new X3DUrlObject (),
	{
		constructor: X3DScriptNode,
	});

	return X3DScriptNode;
});

