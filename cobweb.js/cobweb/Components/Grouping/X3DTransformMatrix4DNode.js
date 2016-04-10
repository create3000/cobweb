
define ([
	"jquery",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DGroupingNode,
          X3DConstants,
          Vector3,
          Rotation4,
          Matrix4)
{
"use strict";

	function traverse (type)
	{
		var modelViewMatrix = this .getBrowser () .getModelViewMatrix ();

		modelViewMatrix .push ();
		modelViewMatrix .multLeft (this .matrix);
		
		X3DGroupingNode .prototype .traverse .call (this, type);

		modelViewMatrix .pop ();
	}

	function X3DTransformMatrix4DNode (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .X3DTransformMatrix4DNode);

		this .matrix = new Matrix4 ();
	}

	X3DTransformMatrix4DNode .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: X3DTransformMatrix4DNode,
		getBBox: function ()
		{
			var bbox = X3DGroupingNode .prototype .getBBox .call (this);

			if (this .traverse === traverse)
				return bbox .multRight (this .matrix);

			return bbox;
		},
		getMatrix: function ()
		{
			return this .matrix;
		},
		setTransform: function (t, r, s, so, c)
		{
			if (t .equals (Vector3 .Zero) && r .equals (Rotation4 .Identity) && s .equals (Vector3 .One))
			{
				this .matrix .identity ();
				this .traverse = X3DGroupingNode .prototype .traverse;
			}
			else
			{
			   this .matrix .set (t, r, s, so, c);
				this .traverse = traverse;
			}
		},
	});

	return X3DTransformMatrix4DNode;
});


