
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
	function X3DEnvironmentalEffectsContext () { }

	X3DEnvironmentalEffectsContext .prototype =
	{
		initialize: function ()
		{
			// Create default shader.

			var vertexShader = new ShaderPart (this);
			vertexShader .type_ = "VERTEX";
			vertexShader .url_ .push (vertexShaderText);
			vertexShader .setup ();

			var fragmentShader = new ShaderPart (this);
			fragmentShader .type_ = "FRAGMENT";
			fragmentShader .url_ .push (fragmentShaderText);
			fragmentShader .setup ();

			this .backgroundSphereShader = new ComposedShader (this);
			this .backgroundSphereShader .language_ = "GLSL";
			this .backgroundSphereShader .parts_ .push (vertexShader);
			this .backgroundSphereShader .parts_ .push (fragmentShader);
			this .backgroundSphereShader .setup ();

			this .backgroundTextureProperties = new TextureProperties (this);
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
