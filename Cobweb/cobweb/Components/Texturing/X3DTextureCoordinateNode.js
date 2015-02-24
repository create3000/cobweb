
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometricPropertyNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometricPropertyNode, 
          X3DConstants)
{
	function X3DTextureCoordinateNode (browser, executionContext)
	{
		X3DGeometricPropertyNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTextureCoordinateNode);
	}

	X3DTextureCoordinateNode .prototype = $.extend (new X3DGeometricPropertyNode (),
	{
		constructor: X3DTextureCoordinateNode,
	});

	return X3DTextureCoordinateNode;
});

