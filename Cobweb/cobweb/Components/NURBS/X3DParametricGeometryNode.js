
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometryNode, 
          X3DConstants)
{
	function X3DParametricGeometryNode (browser, executionContext)
	{
		X3DGeometryNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DParametricGeometryNode);
	}

	X3DParametricGeometryNode .prototype = $.extend (new X3DGeometryNode (),
	{
		constructor: X3DParametricGeometryNode,
	});

	return X3DParametricGeometryNode;
});

