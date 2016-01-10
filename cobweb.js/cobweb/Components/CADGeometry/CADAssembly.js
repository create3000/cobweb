
define ("cobweb/Components/CADGeometry/CADAssembly",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/CADGeometry/X3DProductStructureChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DProductStructureChildNode, 
          X3DConstants)
{
"use strict";

	function CADAssembly (executionContext)
	{
		X3DGroupingNode              .call (this, executionContext);
		X3DProductStructureChildNode .call (this, executionContext);

		this .addType (X3DConstants .CADAssembly);
	}

	CADAssembly .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
		//X3DProductStructureChildNode .prototype,
	{
		constructor: CADAssembly,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "name",           new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "CADAssembly";
		},
		getComponentName: function ()
		{
			return "CADGeometry";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return CADAssembly;
});


