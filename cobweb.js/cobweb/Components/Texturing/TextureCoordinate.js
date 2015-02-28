
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureCoordinateNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureCoordinateNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TextureCoordinate (executionContext)
		{
			X3DTextureCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureCoordinate);
		}

		TextureCoordinate .prototype = $.extend (new X3DTextureCoordinateNode (),
		{
			constructor: TextureCoordinate,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new MFVec2f ()),
			]),
			getTypeName: function ()
			{
				return "TextureCoordinate";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "texCoord";
			},
		});

		return TextureCoordinate;
	}
});

