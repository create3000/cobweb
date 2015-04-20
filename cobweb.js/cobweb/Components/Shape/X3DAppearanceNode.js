
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DAppearanceNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DAppearanceNode);
	}

	X3DAppearanceNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DAppearanceNode,
	});

	return X3DAppearanceNode;
});

