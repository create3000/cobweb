
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DColorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DColorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ColorRGBA (executionContext)
		{
			X3DColorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ColorRGBA);
		}

		ColorRGBA .prototype = $.extend (new X3DColorNode (),
		{
			constructor: ColorRGBA,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",    new MFColorRGBA ()),
			]),
			getTypeName: function ()
			{
				return "ColorRGBA";
			},
			getComponentName: function ()
			{
				return "Rendering";
			},
			getContainerField: function ()
			{
				return "color";
			},
		});

		return ColorRGBA;
	}
});

