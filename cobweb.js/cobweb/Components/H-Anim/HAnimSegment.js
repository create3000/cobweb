
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
		function HAnimSegment (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .HAnimSegment);
		}

		HAnimSegment .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
		{
			constructor: HAnimSegment,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",      new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",         new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "centerOfMass",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "displacers",       new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "mass",             new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "momentsOfInertia", new MFFloat ([, 0,, 0,, 0,, 0,, 0,, 0,, 0,, 0,, 0, ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "name",             new SFString ("")),
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
	}
});

