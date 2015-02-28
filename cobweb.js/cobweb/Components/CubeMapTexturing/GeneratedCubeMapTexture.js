
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/CubeMapTexturing/X3DEnvironmentTextureNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentTextureNode, 
          X3DConstants)
{
	with (Fields)
	{
		function GeneratedCubeMapTexture (executionContext)
		{
			X3DEnvironmentTextureNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeneratedCubeMapTexture);
		}

		GeneratedCubeMapTexture .prototype = $.extend (new X3DEnvironmentTextureNode (),
		{
			constructor: GeneratedCubeMapTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "update",            new SFString ("NONE")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "size",              new SFInt32 (128)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeneratedCubeMapTexture";
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

		return GeneratedCubeMapTexture;
	}
});

