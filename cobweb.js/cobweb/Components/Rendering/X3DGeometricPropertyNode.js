
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DGeometricPropertyNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DGeometricPropertyNode);
	}

	X3DGeometricPropertyNode .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DGeometricPropertyNode,
	});

	return X3DGeometricPropertyNode;
});

