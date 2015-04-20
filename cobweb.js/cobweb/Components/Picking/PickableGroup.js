
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/Picking/X3DPickableObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DPickableObject, 
          X3DConstants)
{
	with (Fields)
	{
		function PickableGroup (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DPickableObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PickableGroup);
		}

		PickableGroup .prototype = $.extend (Object .create (X3DGroupingNode .prototype),new X3DPickableObject (),
		{
			constructor: PickableGroup,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "pickable",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "objectType",     new MFString ("ALL")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "PickableGroup";
			},
			getComponentName: function ()
			{
				return "Picking";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return PickableGroup;
	}
});

