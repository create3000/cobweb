
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DBoundedObject, 
          X3DConstants)
{
"use strict";

	function HAnimHumanoid (executionContext)
	{
		X3DChildNode .call (this, executionContext .getBrowser (), executionContext);
		X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .HAnimHumanoid);
	}

	HAnimHumanoid .prototype = $.extend (Object .create (X3DChildNode .prototype),new X3DBoundedObject (),
	{
		constructor: HAnimHumanoid,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "center",           new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "info",             new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "joints",           new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "name",             new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",         new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",            new Fields .SFVec3f (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "scaleOrientation", new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "segments",         new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "sites",            new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "skeleton",         new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "skin",             new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "skinCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "skinNormal",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "translation",      new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "version",          new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "viewpoints",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "HAnimHumanoid";
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

	return HAnimHumanoid;
});


