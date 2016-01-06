
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DCast,
          X3DConstants,
          Box3)
{
"use strict";

	function Switch (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .Switch);

		this .addAlias ("choice", this .children_);
	}

	Switch .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: Switch,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "whichChoice",    new Fields .SFInt32 (-1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "Switch";
		},
		getComponentName: function ()
		{
			return "Grouping";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DGroupingNode .prototype .initialize .call (this);
			
			this .whichChoice_ .addInterest (this, "set_whichChoice__");
			
			this .set_whichChoice__ ();
		},
		getBBox: function () 
		{
			if (this .bboxSize_ .getValue () .equals (this .defaultBBoxSize))
			{
				var boundedObject = X3DCast (X3DConstants .X3DBoundedObject, this .child);

				if (boundedObject)
					return boundedObject .getBBox ();

				return new Box3 ();
			}

			return new Box3 (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
		},
		set_whichChoice__: function ()
		{
			this .set_cameraObjects__ ();
		},
		set_cameraObjects__: function ()
		{
			this .child = this .getChild (this .whichChoice_ .getValue ());

			if (this .child && this .child .getCameraObject)
				this .setCameraObject (this .child .getCameraObject ());
			else
				this .setCameraObject (false);
		},
		traverse: function (type)
		{
			if (this .child)
				this .child .traverse (type);
		},
	});

	return Switch;
});


