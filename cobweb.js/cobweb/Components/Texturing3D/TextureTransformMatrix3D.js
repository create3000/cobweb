
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureTransformNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureTransformNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TextureTransformMatrix3D (executionContext)
		{
			X3DTextureTransformNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureTransformMatrix3D);
		}

		TextureTransformMatrix3D .prototype = $.extend (Object .create (X3DTextureTransformNode .prototype),
		{
			constructor: TextureTransformMatrix3D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "matrix",   new SFMatrix4f (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)),
			]),
			getTypeName: function ()
			{
				return "TextureTransformMatrix3D";
			},
			getComponentName: function ()
			{
				return "Texturing3D";
			},
			getContainerField: function ()
			{
				return "textureTransform";
			},
		});

		return TextureTransformMatrix3D;
	}
});

