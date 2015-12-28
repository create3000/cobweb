
define ([
	"cobweb/Components/Shaders/ComposedShader",
	"cobweb/Components/Shaders/ShaderPart",
	"cobweb/Components/Texturing/TextureProperties",
	"text!cobweb/Browser/EnvironmentalEffects/SphereVertexShader.vs",
	"text!cobweb/Browser/EnvironmentalEffects/SphereFragmentShader.fs",
],
function (ComposedShader,
          ShaderPart,
          TextureProperties,
          vertexShaderText,
          fragmentShaderText)
{
"use strict";
	
	function X3DEnvironmentalEffectsContext ()
	{
		this .backgroundTextureProperties = new TextureProperties (this);
	}

	X3DEnvironmentalEffectsContext .prototype =
	{
		initialize: function ()
		{
			this .backgroundSphereShader = this .createShader (this, vertexShaderText, fragmentShaderText);

			this .backgroundTextureProperties .boundaryModeS_       = "CLAMP_TO_EDGE";
			this .backgroundTextureProperties .boundaryModeT_       = "CLAMP_TO_EDGE";
			this .backgroundTextureProperties .boundaryModeR_       = "CLAMP_TO_EDGE";
			this .backgroundTextureProperties .minificationFilter_  = "NICEST";
			this .backgroundTextureProperties .magnificationFilter_ = "NICEST";
			this .backgroundTextureProperties .setup ();
		},
		getBackgroundSphereShader: function ()
		{
			return this .backgroundSphereShader;
		},
		getBackgroundTextureProperties: function ()
		{
			return this .backgroundTextureProperties;
		},
	};

	return X3DEnvironmentalEffectsContext;
});
