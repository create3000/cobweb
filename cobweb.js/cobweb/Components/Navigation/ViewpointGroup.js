
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Navigation/X3DViewpointObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DViewpointObject, 
          X3DConstants)
{
	with (Fields)
	{
		function ViewpointGroup (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);
			X3DViewpointObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ViewpointGroup);
		}

		ViewpointGroup .prototype = $.extend (Object .create (X3DChildNode .prototype),new X3DViewpointObject (),
		{
			constructor: ViewpointGroup,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "displayed",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "size",              new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",            new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "children",          new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "ViewpointGroup";
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

		return ViewpointGroup;
	}
});

