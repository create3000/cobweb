
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/CubeMapTexturing/X3DEnvironmentTextureNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentTextureNode, 
          X3DUrlObject, 
          X3DConstants)
{
	with (Fields)
	{
		function ImageCubeMapTexture (executionContext)
		{
			X3DEnvironmentTextureNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ImageCubeMapTexture);
		}

		ImageCubeMapTexture .prototype = $.extend (new X3DEnvironmentTextureNode (),new X3DUrlObject (),
		{
			constructor: ImageCubeMapTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",               new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "ImageCubeMapTexture";
			},
			getComponentName: function ()
			{
				return "CubeMapTexturing";
			},
			getContainerField: function ()
			{
				return "texture";
			},
		});

		return ImageCubeMapTexture;
	}
});

