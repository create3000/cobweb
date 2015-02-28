
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
		function Billboard (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Billboard);
		}

		Billboard .prototype = $.extend (new X3DGroupingNode (),
		{
			constructor: Billboard,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "axisOfRotation", new SFVec3f (0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Billboard";
			},
			getComponentName: function ()
			{
				return "Navigation";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Billboard;
	}
});

