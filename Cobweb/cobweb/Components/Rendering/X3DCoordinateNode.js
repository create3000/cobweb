
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometricPropertyNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometricPropertyNode, 
          X3DConstants)
{
	function X3DCoordinateNode (browser, executionContext)
	{
		X3DGeometricPropertyNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DCoordinateNode);
	}

	X3DCoordinateNode .prototype = $.extend (new X3DGeometricPropertyNode (),
	{
		constructor: X3DCoordinateNode,
	});

	return X3DCoordinateNode;
});

