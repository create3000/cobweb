
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TouchGroup (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TouchGroup);
		}

		TouchGroup .prototype = $.extend (new X3DGroupingNode (),new X3DSensorNode (),
		{
			constructor: TouchGroup,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",        new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "TouchGroup";
			},
			getComponentName: function ()
			{
				return "Titania";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return TouchGroup;
	}
});

