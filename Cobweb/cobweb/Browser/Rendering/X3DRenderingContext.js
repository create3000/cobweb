
define ([
	"text!cobweb/Browser/Rendering/VertexShader.vs",
	"text!cobweb/Browser/Rendering/FragmentShader.fs",
	"cobweb/Components/Shaders/ComposedShader",
	"cobweb/Components/Shaders/ShaderPart",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
	"jquery-plugin/jquery.ba-resize.min",
],
function (vertexShaderText,
          fragmentShaderText,
          ComposedShader,
          ShaderPart,
          Vector4,
          Matrix4,
          MatrixStack)
{
	function X3DRenderingContext (x3d)
	{
		this .x3d              = x3d;
		this .projectionMatrix = new MatrixStack (Matrix4);
		this .modelViewMatrix  = new MatrixStack (Matrix4);
		this .viewport         = new Vector4 ();
	}

	X3DRenderingContext .prototype =
	{
		initialize: function ()
		{
			// Get canvas & context.

			this .canvas  = $("<canvas/>") .prependTo (this .x3d);
			this .context = this .canvas [0] .getContext ("experimental-webgl");

			// Configure context.

			var gl = this .context;

			gl .enable (gl .SCISSOR_TEST);
			gl .cullFace (gl .BACK);
			gl .enable (gl .DEPTH_TEST);
			gl .depthFunc (gl .LEQUAL);
			gl .clearDepth (1.0);

			gl .blendFuncSeparate (gl .SRC_ALPHA, gl .ONE_MINUS_SRC_ALPHA, gl .ONE, gl .ONE_MINUS_SRC_ALPHA);
			gl .disable (gl .BLEND);

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

			// Configure viewport.

			this .canvas .resize (function ()
			{
				this .reshape ();
				this .update ();
			}
			.bind (this));

			this .reshape ();
		},
		getCanvas: function ()
		{
			return this .canvas;
		},
		getContext: function ()
		{
			return this .context;
		},
		getProjectionMatrix: function ()
		{
			return this .projectionMatrix;
		},
		getModelViewMatrix: function ()
		{
			return this .modelViewMatrix;
		},
		getViewport: function ()
		{
			return this .viewport;
		},
		getDefaultShader: function ()
		{
			return this .defaultShader;
		},
		reshape: function ()
		{
			var width  = this .canvas .width ();
			var height = this .canvas .height ();

			this .viewport .set (0, 0, width, height);
			this .context .viewport (0, 0, width, height);
			this .context .scissor (0, 0, width, height);

			this .canvas [0] .width  = width;
			this .canvas [0] .height = height;
		},
	};

	return X3DRenderingContext;
});
