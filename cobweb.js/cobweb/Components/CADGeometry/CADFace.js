
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/CADGeometry/X3DProductStructureChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Box3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DProductStructureChildNode, 
          X3DBoundedObject,
          X3DCast,
          X3DConstants,
          Box3)
{
"use strict";

	function traverse (type)
	{
		this .shapeNode .traverse (type);
	}

	function CADFace (executionContext)
	{
		X3DProductStructureChildNode .call (this, executionContext .getBrowser (), executionContext);
		X3DBoundedObject             .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .CADFace);

		this .shapeNode = null;
	}

	CADFace .prototype = $.extend (Object .create (X3DProductStructureChildNode .prototype),
		X3DBoundedObject .prototype,
	{
		constructor: CADFace,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "name",       new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "shape",      new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "CADFace";
		},
		getComponentName: function ()
		{
			return "CADGeometry";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DProductStructureChildNode .prototype .initialize .call (this);
			X3DBoundedObject             .prototype .initialize .call (this);

			this .shape_ .addInterest (this, "set_shape__");

			this .set_shape__ ();
		},
		getBBox: function ()
		{
			if (this .bboxSize_ .getValue () .equals (this .defaultBBoxSize))
			{
				var boundedObject = X3DCast (X3DConstants .X3DBoundedObject, this .shape_);
		
				if (boundedObject)
					return boundedObject .getBBox ();
		
				return new Box3 ();
			}
		
			return new Box3 (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
		},
		set_shape__: function ()
		{
			this .shapeNode = this .shape_ .getValue ();

			if (this .shapeNode)
				this .traverse = traverse;
			else
				delete this .traverse;
		},
	});

	return CADFace;
});


