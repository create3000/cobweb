
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DConstants)
{
"use strict";

	function HAnimSegment (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .HAnimSegment);
	}

	HAnimSegment .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: HAnimSegment,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",      new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",   new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",         new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "centerOfMass",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",            new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "displacers",       new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "mass",             new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "momentsOfInertia", new Fields .MFFloat ([ 0, 0, 0, 0, 0, 0, 0, 0, 0 ])),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "name",             new Fields .SFString ()),
		]),
		getTypeName: function ()
		{
			return "HAnimSegment";
		},
		getComponentName: function ()
		{
			return "H-Anim";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return HAnimSegment;
});


