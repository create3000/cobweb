
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
		function ComposedCubeMapTexture (executionContext)
		{
			X3DEnvironmentTextureNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ComposedCubeMapTexture);
		}

		ComposedCubeMapTexture .prototype = $.extend (Object .create (X3DEnvironmentTextureNode .prototype),
		{
			constructor: ComposedCubeMapTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "front",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "back",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "left",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "right",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "bottom",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "top",      new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "ComposedCubeMapTexture";
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

		return ComposedCubeMapTexture;
	}
});

