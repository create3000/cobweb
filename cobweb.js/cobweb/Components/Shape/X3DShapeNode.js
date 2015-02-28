
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
		},
		isTransparent: function ()
		{
			return this .apparanceNode .isTransparent () ||
			       this .geometryNode .isTransparent ();
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
			this .apparanceNode = this .appearance_ .getValue ();
			
			if (! this .apparanceNode)
				this .apparanceNode = this .getBrowser () .getDefaultAppearance ();
		},
		set_geometry__: function ()
		{
			this .geometryNode = this .geometry_ .getValue ();
		},
	});

	return X3DShapeNode;
});

