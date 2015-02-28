
define ([
	"jquery",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DGroupingNode, 
          X3DConstants,
          Matrix4)
{
	function X3DTransformMatrix4DNode (browser, executionContext)
	{
		X3DGroupingNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTransformMatrix4DNode);
		
		this .matrix = new Matrix4 ();
	}

	X3DTransformMatrix4DNode .prototype = $.extend (new X3DGroupingNode (),
	{
		constructor: X3DTransformMatrix4DNode,
		setTransform: function (t, r, s, so, c)
		{
			this .matrix .set (t, r, s, so, c);
		},
		traverse: function (type)
		{
			var modelViewMatrix = this .getBrowser () .getModelViewMatrix ();

			modelViewMatrix .push ();
			modelViewMatrix .multLeft (this .matrix);

			X3DGroupingNode .prototype .traverse .call (this, type);

			modelViewMatrix .pop ();
		},
	});

	return X3DTransformMatrix4DNode;
});

