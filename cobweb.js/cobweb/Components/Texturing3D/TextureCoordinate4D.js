
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
		function TextureCoordinate4D (executionContext)
		{
			X3DTextureCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureCoordinate4D);
		}

		TextureCoordinate4D .prototype = $.extend (Object .create (X3DTextureCoordinateNode .prototype),
		{
			constructor: TextureCoordinate4D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new MFVec4f ()),
			]),
			getTypeName: function ()
			{
				return "TextureCoordinate4D";
			},
			getComponentName: function ()
			{
				return "Texturing3D";
			},
			getContainerField: function ()
			{
				return "texCoord";
			},
		});

		return TextureCoordinate4D;
	}
});

