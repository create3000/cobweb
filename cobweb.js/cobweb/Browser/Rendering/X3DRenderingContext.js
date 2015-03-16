
//https://github.com/sdecima/javascript-detect-element-resize

define ([
	"cobweb/Fields",
	"cobweb/Components/Shaders/ComposedShader",
	"cobweb/Components/Shaders/ShaderPart",
	"text!cobweb/Browser/Rendering/Gouraud.vs",
	"text!cobweb/Browser/Rendering/Gouraud.fs",
	"text!cobweb/Browser/Rendering/Phong.vs",
	"text!cobweb/Browser/Rendering/Phong.fs",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
],
function (Fields,
          ComposedShader,
          ShaderPart,
          gouraudVS,
          gouraudFS,
          phongVS,
          phongFS,
          Vector4,
          Matrix4,
          MatrixStack)
{
	var MFInt32 = Fields .MFInt32;

	function X3DRenderingContext (x3d)
	{
		this .setProjectionMatrix (new Matrix4 ());
		this .modelViewMatrix    = new MatrixStack (Matrix4);
		this .viewport           = new Vector4 ();
		this .defaultColorBuffer = null;
	}

	X3DRenderingContext .prototype =
	{
		initialize: function ()
		{
			this .addChildren ("viewport", new MFInt32 (0, 0, 100, 100));

			// Configure context.

			var gl = this .getContext ();

			gl .enable (gl .SCISSOR_TEST);
			gl .cullFace (gl .BACK);
			gl .enable (gl .DEPTH_TEST);
			gl .depthFunc (gl .LEQUAL);
			gl .clearDepth (1.0);

			gl .blendFuncSeparate (gl .SRC_ALPHA, gl .ONE_MINUS_SRC_ALPHA, gl .ONE, gl .ONE_MINUS_SRC_ALPHA);
			gl .enable (gl .BLEND);

			// Create default color buffer.

			this .defaultColorBuffer         = gl .createBuffer ();
			this .defaultColorBuffer .length = 0;

			// Configure viewport.

			setInterval (this .reshape .bind (this), 401);

			this .reshape ();

			//this .setDefaultShader ("PHONG");
			this .setDefaultShader ("GOURAUD");
		},
		getVendor: function ()
		{
			return this .getContext () .getParameter (this .getContext () .VENDOR);
		},
		getWebGLVersion: function ()
		{
			return this .getContext () .getParameter (this .getContext () .VERSION);
		},
		getAntialiased: function ()
		{
			return this .getContext () .getParameter (this .getContext () .SAMPLES) > 0;
		},
		getColorDepth: function ()
		{
			var gl = this .context;

			var colorDepth = 0;
			colorDepth += gl .getParameter (gl .RED_BITS);
			colorDepth += gl .getParameter (gl .BLUE_BITS);
			colorDepth += gl .getParameter (gl .GREEN_BITS);
			colorDepth += gl .getParameter (gl .ALPHA_BITS);

			return colorDepth;
		},
		setProjectionMatrix: function (value)
		{
			this .projectionMatrix        = value;
			this .projectionMatrix .array = new Float32Array (value);
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
			return this .viewport_;
		},
		setDefaultColorBuffer: function (length)
		{
			if (length > this .defaultColorBuffer .length)
			{
				var gl = this .context;
				gl .bindBuffer (gl .ARRAY_BUFFER, this .defaultColorBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, new Float32Array ({ length: length }), gl .STATIC_DRAW);
				this .defaultColorBuffer .length = length;
			}
		},
		getDefaultColorBuffer: function ()
		{
			return this .defaultColorBuffer;
		},
		setDefaultShader: function (type)
		{
			switch (type)
			{
				case "PHONG":
				{
					var vertexShader = new ShaderPart (this);
					vertexShader .type_ = "VERTEX";
					vertexShader .url_ .push (phongVS);
					vertexShader .setup ();

					var fragmentShader = new ShaderPart (this);
					fragmentShader .type_ = "FRAGMENT";
					fragmentShader .url_ .push (phongFS);
					fragmentShader .setup ();

					this .defaultShader = new ComposedShader (this);
					this .defaultShader .language_ = "GLSL";
					this .defaultShader .parts_ .push (vertexShader);
					this .defaultShader .parts_ .push (fragmentShader);
					this .defaultShader .setup ();

					break;
				}
				default:
				{
					var vertexShader = new ShaderPart (this);
					vertexShader .type_ = "VERTEX";
					vertexShader .url_ .push (gouraudVS);
					vertexShader .setup ();

					var fragmentShader = new ShaderPart (this);
					fragmentShader .type_ = "FRAGMENT";
					fragmentShader .url_ .push (gouraudFS);
					fragmentShader .setup ();

					this .defaultShader = new ComposedShader (this);
					this .defaultShader .language_ = "GLSL";
					this .defaultShader .parts_ .push (vertexShader);
					this .defaultShader .parts_ .push (fragmentShader);
					this .defaultShader .setup ();

					break;
				}
			}
		},
		getDefaultShader: function ()
		{
			return this .defaultShader;
		},
		reshape: function ()
		{
			var
				width  = this .canvas .width (),
				height = this .canvas .height (),
				canvas = this .canvas [0];

			if (width !== canvas .width || height !== canvas .height)
			{
				this .viewport_ .setValue ([0, 0, width, height]);
				this .context .viewport (0, 0, width, height);
				this .context .scissor (0, 0, width, height);

				canvas .width  = width;
				canvas .height = height;

				this .addBrowserEvent ();
			}
		},
	};

	return X3DRenderingContext;
});
