
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
		getBBox: function ()
		{
			var bbox = X3DGroupingNode .prototype .getBBox .call (this);

			return bbox .copy () .multRight (this .matrix);
		},
		setTransform: function (t, r, s, so, c)
		{
			this .matrix .set (t, r, s, so, c);

			if (this .matrix .equals (Matrix4 .Identity))
				this .traverse = X3DGroupingNode .prototype .traverse;

			else
				this .traverse = traverse;
		},
	});

	function traverse (type)
	{
		var modelViewMatrix = this .getBrowser () .getModelViewMatrix ();

		modelViewMatrix .push ();
		modelViewMatrix .multLeft (this .matrix);
		
		X3DGroupingNode .prototype .traverse .call (this, type);

		modelViewMatrix .pop ();
	}

	return X3DTransformMatrix4DNode;
});

