
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometryNode, 
          X3DConstants)
{
	function X3DComposedGeometryNode (browser, executionContext)
	{
		X3DGeometryNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DComposedGeometryNode);
	}

	X3DComposedGeometryNode .prototype = $.extend (new X3DGeometryNode (),
	{
		constructor: X3DComposedGeometryNode,
	});

	return X3DComposedGeometryNode;
});

