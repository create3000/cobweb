
define ("cobweb/Components/Layout/LayoutGroup",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode,
          X3DCast,
          TraverseType,
          X3DConstants,
          Matrix4)
{
"use strict";

	function LayoutGroup (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .LayoutGroup);

		this .viewportNode    = null;
		this .layoutNode      = null;
		this .modelViewMatrix = new Matrix4 ();
		this .screenMatrix    = new Matrix4 ();
	}

	LayoutGroup .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: LayoutGroup,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "layout",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "viewport",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "LayoutGroup";
		},
		getComponentName: function ()
		{
			return "Layout";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DGroupingNode .prototype .initialize .call (this);

			this .viewport_ .addInterest (this, "set_viewport__");
			this .layout_   .addInterest (this, "set_layout__");
		
			this .set_viewport__ ();
			this .set_layout__ ();
		},
		set_viewport__: function ()
		{
			this .viewportNode = X3DCast (X3DConstants .X3DViewportNode, this .viewport_);
		},
		set_layout__: function ()
		{
			this .layoutNode = X3DCast (X3DConstants .X3DLayoutNode, this .layout_);
		},
		getBBox: function ()
		{
			return X3DGroupingNode .prototype .getBBox .call (this) .multRight (this .getMatrix ());
		},
		getMatrix: function ()
		{
			try
			{
				if (this .layoutNode)
					this .matrix .assign (this .modelViewMatrix) .inverse () .multLeft (this .screenMatrix);
				else
					this .matrix .identity ();
			}
			catch (error)
			{ }
		
			return this .matrix;
		},
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .POINTER:
				case TraverseType .CAMERA:
				case TraverseType .DISPLAY:
				{
					if (this .viewportNode)
						this .viewportNode .push ();

					if (this .layoutNode)
					{
						var
							browser         = this .getBrowser (),
							modelViewMatrix = browser .getModelViewMatrix ();

						this .modelViewMatrix .assign (modelViewMatrix .get ());

						modelViewMatrix .push ();
						modelViewMatrix .set (this .screenMatrix .assign (this .layoutNode .transform (type)));
						browser .getLayouts () .push (this .layoutNode);

						X3DGroupingNode .prototype .traverse .call (this, type);

						browser .getLayouts () .pop ();
						modelViewMatrix .pop ();
					}
					else
						X3DGroupingNode .prototype .traverse .call (this, type);
		
					if (this .viewportNode)
						this .viewportNode .pop ();
		
					break;
				}
			}
		},
	});

	return LayoutGroup;
});


