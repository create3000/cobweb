
define ([
	"cobweb/Components/Shaders/ComposedShader",
	"cobweb/Components/Shaders/ShaderPart",
	"text!cobweb/Browser/Shaders/VertexShader.vs",
	"text!cobweb/Browser/Shaders/FragmentShader.fs",
],
function (ComposedShader,
          ShaderPart,
          vertexShaderText,
          fragmentShaderText)
{
	function X3DShadersContext ()
	{

	}

	X3DShadersContext .prototype =
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

			this .defaultShader = new ComposedShader (this);
			this .defaultShader .language_ = "GLSL";
			this .defaultShader .parts_ .push (vertexShader);
			this .defaultShader .parts_ .push (fragmentShader);
			this .defaultShader .setup ();
		},
		getDefaultShader: function ()
		{
			return this .defaultShader;
		},
		getShadingLanguageVersion: function ()
		{
			return this .getContext () .getParameter (this .getContext () .SHADING_LANGUAGE_VERSION);
		},
		getMaxVertexUniformVectors: function ()
		{
			return this .getContext () .getParameter (this .getContext () .MAX_VERTEX_UNIFORM_VECTORS);
		},
		getMaxFragmentUniformVectors: function ()
		{
			return this .getContext () .getParameter (this .getContext () .MAX_FRAGMENT_UNIFORM_VECTORS);
		},
		getMaxVertexAttribs: function ()
		{
			return this .getContext () .getParameter (this .getContext () .MAX_VERTEX_ATTRIBS);
		},
	};

	return X3DShadersContext;
});
