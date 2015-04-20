
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function FillProperties (executionContext)
		{
			X3DAppearanceChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .FillProperties);
		}

		FillProperties .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
		{
			constructor: FillProperties,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "filled",     new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "hatched",    new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "hatchStyle", new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "hatchColor", new SFColor (1, 1, 1)),
			]),
			getTypeName: function ()
			{
				return "FillProperties";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "fillProperties";
			},
		});

		return FillProperties;
	}
});

