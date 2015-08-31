
//https://github.com/sdecima/javascript-detect-element-resize

define ([
	"cobweb/Fields",
	"cobweb/Components/Shaders/ComposedShader",
	"cobweb/Components/Shaders/ShaderPart",
	"text!cobweb/Browser/Rendering/Wireframe.vs",
	"text!cobweb/Browser/Rendering/Wireframe.fs",
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
          wireframeVS,
          wireframeFS,
          gouraudVS,
          gouraudFS,
          phongVS,
          phongFS,
          Vector4,
          Matrix4,
          MatrixStack)
{
	var MFInt32 = Fields .MFInt32;
	
	function getShader (executionContext, vs, fs)
	{
		var vertexShader = new ShaderPart (executionContext);
		vertexShader .type_ = "VERTEX";
		vertexShader .url_ .push (vs);
		vertexShader .setup ();

		var fragmentShader = new ShaderPart (executionContext);
		fragmentShader .type_ = "FRAGMENT";
		fragmentShader .url_ .push (fs);
		fragmentShader .setup ();

		var shader = new ComposedShader (executionContext);
		shader .language_ = "GLSL";
		shader .parts_ .push (vertexShader);
		shader .parts_ .push (fragmentShader);
		shader .setup ();

		return shader;
	}

	function getPointShader (executionContext, lineShader)
	{
		var shader = new ComposedShader (executionContext);
		shader .language_ = "GLSL";
		shader .parts_ = lineShader .parts_;
		shader .setup ();

		return shader;
	}

	function X3DRenderingContext (x3d)
	{
		this .projectionMatrix      = new Matrix4 ();
		this .projectionMatrixArray = new Float32Array (16);
		this .modelViewMatrix       = new MatrixStack (Matrix4);
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

			// Configure viewport.

			setInterval (this .reshape .bind (this), 401);

			this .reshape ();

			this .lineShader  = getShader (this, wireframeVS, wireframeFS);
			this .pointShader = getPointShader (this, this .lineShader);

			this .setDefaultShader (this .getXML () [0] .getAttribute ("shading"));
			this .setShader (this .getDefaultShader ());
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
			this .projectionMatrix = value;
			this .projectionMatrixArray .set (value);
		},
		getProjectionMatrix: function ()
		{
			return this .projectionMatrix;
		},
		getProjectionMatrixArray: function ()
		{
			return this .projectionMatrixArray;
		},
		getModelViewMatrix: function ()
		{
			return this .modelViewMatrix;
		},
		getViewport: function ()
		{
			return this .viewport_;
		},
		setDefaultShader: function (type)
		{
			var gl = this .context;

			switch (type)
			{
				case "POINTSET":
				{
					if (! this .gouraudShader)
						this .gouraudShader = getShader (this, gouraudVS, gouraudFS, gl .TRIANGLES);

					this .defaultShader = this .gouraudShader;

					this .pointShader   .primitiveMode = gl .POINTS;
					this .lineShader    .primitiveMode = gl .POINTS;
					this .defaultShader .primitiveMode = gl .POINTS;
					
					this .pointShader   .wireframe = true;
					this .lineShader    .wireframe = true;
					this .defaultShader .wireframe = true;					
					break;
				}
				case "WIREFRAME":
				{
					if (! this .gouraudShader)
						this .gouraudShader = getShader (this, gouraudVS, gouraudFS, gl .TRIANGLES);

					this .defaultShader = this .gouraudShader;

					this .pointShader   .primitiveMode = gl .POINTS;
					this .lineShader    .primitiveMode = gl .LINES;
					this .defaultShader .primitiveMode = gl .LINE_LOOP;
					
					this .pointShader   .wireframe = true;
					this .lineShader    .wireframe = true;
					this .defaultShader .wireframe = true;					
					break;
				}
				case "PHONG":
				{
					if (! this .phongShader)
						this .phongShader = getShader (this, phongVS, phongFS, gl .TRIANGLES);

					this .defaultShader = this .phongShader;

					this .pointShader   .primitiveMode = gl .POINTS;
					this .lineShader    .primitiveMode = gl .LINES;
					this .defaultShader .primitiveMode = gl .TRIANGLES;

					this .pointShader   .wireframe = true;
					this .lineShader    .wireframe = true;
					this .defaultShader .wireframe = false;					
					break;
				}
				default:
				{
					// case "GOURAUD":

					if (! this .gouraudShader)
						this .gouraudShader = getShader (this, gouraudVS, gouraudFS, gl .TRIANGLES);

					this .defaultShader = this .gouraudShader;

					this .pointShader   .primitiveMode = gl .POINTS;
					this .lineShader    .primitiveMode = gl .LINES;
					this .defaultShader .primitiveMode = gl .TRIANGLES;

					this .pointShader   .wireframe = true;
					this .lineShader    .wireframe = true;
					this .defaultShader .wireframe = false;					
					break;
				}
			}
		},
		getDefaultShader: function ()
		{
			return this .defaultShader;
		},
		getPointShader: function ()
		{
			return this .pointShader;
		},
		getLineShader: function ()
		{
			return this .lineShader;
		},
		getGouraudShader: function ()
		{
			// There must always be a gouraud shader available.
			return this .gouraudShader;
		},
		setShader: function (value)
		{
			this .shader = value;
		},
		getShader: function ()
		{
			return this .shader;
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
