
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DColorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DColorNode, 
          X3DConstants,
          Color4)
{
	with (Fields)
	{
		function ColorRGBA (executionContext)
		{
			X3DColorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ColorRGBA);
		}

		ColorRGBA .prototype = $.extend (Object .create (X3DColorNode .prototype),
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
			isTransparent: function ()
			{
				return true;
			},
			getColor: function (index)
			{
				if (index < this .color_ .length)
					return this .color_ [index] .getValue ();
		
				return new Color4 (1, 1, 1, 1);
			},
		});

		return ColorRGBA;
	}
});

