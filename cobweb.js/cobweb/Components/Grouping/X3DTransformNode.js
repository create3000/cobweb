
define ([
	"jquery",
	"cobweb/Components/Grouping/X3DTransformMatrix4DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DTransformMatrix4DNode, 
          X3DConstants)
{
	function X3DTransformNode (browser, executionContext)
	{
		X3DTransformMatrix4DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DTransformNode);
	}

	X3DTransformNode .prototype = $.extend (new X3DTransformMatrix4DNode (),
	{
		constructor: X3DTransformNode,
		initialize: function ()
		{
			X3DTransformMatrix4DNode .prototype .initialize .call (this);
			
			this .addInterest (this, "update");

			this .update ();
		},
		update: function ()
		{
			this .setHidden (this .scale_ .x === 0 ||
			                 this .scale_ .y === 0 ||
			                 this .scale_ .z === 0);

			this .setTransform (this .translation_ .getValue (),
			                    this .rotation_ .getValue (),
			                    this .scale_ .getValue (),
			                    this .scaleOrientation_ .getValue (),
			                    this .center_ .getValue ());
		},
	});

	return X3DTransformNode;
});

