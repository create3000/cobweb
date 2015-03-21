
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DBoundedObject, 
          X3DConstants)
{
	function X3DShapeNode (browser, executionContext)
	{
		X3DChildNode     .call (this, browser, executionContext);
		X3DBoundedObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DShapeNode);
	}

	X3DShapeNode .prototype = $.extend (new X3DChildNode (),
		X3DBoundedObject .prototype,
	{
		constructor: X3DShapeNode,
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);

			this .appearance_ .addInterest (this, "set_apparance__");
			this .geometry_   .addInterest (this, "set_geometry__");

			this .set_apparance__ ();
			this .set_geometry__ ();
			this .set_transparent__ ();

			this .static_ = true;
		},
		isTransparent: function ()
		{
			return this .transparent;
		},
		getAppearance: function ()
		{
			return this .apparanceNode;
		},
		getGeometry: function ()
		{
			return this .geometryNode;
		},
		set_apparance__: function ()
		{
			if (this .apparanceNode)
				this .apparanceNode .removeInterest (this, "set_transparent__");

			this .apparanceNode = this .appearance_ .getValue ();
			
			if (this .apparanceNode)
				this .apparanceNode .addInterest (this, "set_transparent__");

			if (! this .apparanceNode)
				this .apparanceNode = this .getBrowser () .getDefaultAppearance ();
		},
		set_geometry__: function ()
		{
			if (this .geometryNode)
			{
				this .geometryNode .removeInterest (this, "set_bbox__");
				this .geometryNode .removeInterest (this, "set_transparent__");
			}

			this .geometryNode = this .geometry_ .getValue ();

			if (this .geometryNode)
			{
				this .geometryNode .addInterest (this, "set_bbox__");
				this .geometryNode .addInterest (this, "set_transparent__");
			}
		},
		set_transparent__: function ()
		{
			this .transparent = (this .apparanceNode && this .apparanceNode .transparent_ .getValue ()) ||
			                    (this .geometryNode && this .geometryNode .transparent_ .getValue ());
		},
	});

	return X3DShapeNode;
});

