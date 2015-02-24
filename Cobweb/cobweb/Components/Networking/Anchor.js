
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DUrlObject, 
          X3DConstants)
{
	with (Fields)
	{
		function Anchor (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Anchor);
		}

		Anchor .prototype = $.extend (new X3DGroupingNode (),new X3DUrlObject (),
		{
			constructor: Anchor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "description",    new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",            new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "parameter",      new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Anchor";
			},
			getComponentName: function ()
			{
				return "Networking";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Anchor;
	}
});

