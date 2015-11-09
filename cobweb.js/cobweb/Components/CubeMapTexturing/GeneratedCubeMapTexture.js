
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
"use strict";

	function GeneratedCubeMapTexture (executionContext)
	{
		X3DEnvironmentTextureNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .GeneratedCubeMapTexture);
	}

	GeneratedCubeMapTexture .prototype = $.extend (Object .create (X3DEnvironmentTextureNode .prototype),
	{
		constructor: GeneratedCubeMapTexture,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "update",            new Fields .SFString ("NONE")),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "size",              new Fields .SFInt32 (128)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new Fields .SFNode ()),
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
});


