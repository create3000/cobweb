
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
	with (Fields)
	{
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
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "center",           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "info",             new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "joints",           new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "name",             new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",         new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",            new SFVec3f (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scaleOrientation", new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "segments",         new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "sites",            new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "skeleton",         new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "skin",             new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "skinCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "skinNormal",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "translation",      new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "version",          new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "viewpoints",       new MFNode ()),
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
	}
});

