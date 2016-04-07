
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
],
function ($,
          X3DChildNode, 
          X3DBoundedObject,
          X3DCast,
          X3DConstants,
          Box3)
{
"use strict";

	function X3DShapeNode (executionContext)
	{
		X3DChildNode     .call (this, executionContext);
		X3DBoundedObject .call (this, executionContext);

		this .addType (X3DConstants .X3DShapeNode);
	}

	X3DShapeNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DBoundedObject .prototype,
	{
		constructor: X3DShapeNode,
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);

			this .bboxSize_   .addInterest (this, "set_bbox__");
			this .bboxCenter_ .addInterest (this, "set_bbox__");
			this .appearance_ .addInterest (this, "set_apparance__");
			this .geometry_   .addInterest (this, "set_geometry__");

			this .set_apparance__ ();
			this .set_geometry__ ();
			this .set_bbox__ ();
		},
		getBBox: function ()
		{
			return this .bbox;
		},
		getBBoxSize: function ()
		{
			return this .bboxSize;
		},
		getBBoxCenter: function ()
		{
			return this .bboxCenter;
		},
		getAppearance: function ()
		{
			return this .apparanceNode;
		},
		getGeometry: function ()
		{
			return this .geometryNode;
		},
		isTransparent: function ()
		{
			return this .transparent;
		},
		set_bbox__: function ()
		{
			if (this .bboxSize_ .getValue () .equals (this .defaultBBoxSize))
			{
				if (this .getGeometry ())
					this .bbox = this .getGeometry () .getBBox ();

				else
					this .bbox = new Box3 ();
			}
			else
				this .bbox = new Box3 (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
			
			this .bboxSize   = this .bbox .size;
			this .bboxCenter = this .bbox .center;
		},
		set_apparance__: function ()
		{
			if (this .apparanceNode)
				this .apparanceNode .removeInterest (this, "set_transparent__");

			this .apparanceNode = X3DCast (X3DConstants .X3DAppearanceNode, this .appearance_);

			if (this .apparanceNode)
				this .apparanceNode .addInterest (this, "set_transparent__");

			else
				this .apparanceNode = this .getBrowser () .getDefaultAppearance ();

			this .set_transparent__ ();
		},
		set_geometry__: function ()
		{
			if (this .geometryNode)
			{
				this .geometryNode .transparent_  .addInterest (this, "set_transparent__");
				this .geometryNode .bbox_changed_ .addInterest (this, "set_bbox__");
			}

			this .geometryNode = X3DCast (X3DConstants .X3DGeometryNode, this .geometry_);

			if (this .geometryNode)
			{
				this .geometryNode .transparent_  .addInterest (this, "set_transparent__");
				this .geometryNode .bbox_changed_ .addInterest (this, "set_bbox__");
			}

			this .set_transparent__ ();
			this .set_bbox__ ();
		},
		set_transparent__: function ()
		{
			this .transparent = (this .apparanceNode && this .apparanceNode .transparent_ .getValue ()) ||
			                    (this .geometryNode && this .geometryNode .transparent_ .getValue ());
		},
	});

	return X3DShapeNode;
});


