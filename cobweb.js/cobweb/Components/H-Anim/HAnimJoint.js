
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
	with (Fields)
	{
		function HAnimJoint (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .HAnimJoint);
		}

		HAnimJoint .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
		{
			constructor: HAnimJoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",      new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",         new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "center",           new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "displacers",       new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "limitOrientation", new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "llimit",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "name",             new SFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",         new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",            new SFVec3f (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scaleOrientation", new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "skinCoordIndex",   new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "skinCoordWeight",  new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "stiffness",        new MFFloat ([ 0, 0, 0 ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "translation",      new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "ulimit",           new MFFloat ()),
			]),
			getTypeName: function ()
			{
				return "HAnimJoint";
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

		return HAnimJoint;
	}
});

