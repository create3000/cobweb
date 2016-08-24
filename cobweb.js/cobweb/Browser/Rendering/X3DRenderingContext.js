
//https://github.com/sdecima/javascript-detect-element-resize

define ([
	"cobweb/Fields",
	"cobweb/Components/Shaders/ComposedShader",
	"cobweb/Components/Shaders/ShaderPart",
	"text!cobweb/Browser/Shaders/PointSet.fs",
	"text!cobweb/Browser/Shaders/Wireframe.vs",
	"text!cobweb/Browser/Shaders/Wireframe.fs",
	"text!cobweb/Browser/Shaders/Gouraud.vs",
	"text!cobweb/Browser/Shaders/Gouraud.fs",
	"text!cobweb/Browser/Shaders/Phong.vs",
	"text!cobweb/Browser/Shaders/Phong.fs",
	"text!cobweb/Browser/Shaders/Depth.vs",
	"text!cobweb/Browser/Shaders/Depth.fs",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
],
function (Fields,
          ComposedShader,
          ShaderPart,
          pointSetFS,
          wireframeVS,
          wireframeFS,
          gouraudVS,
          gouraudFS,
          phongVS,
          phongFS,
          depthVS,
          depthFS,
          Vector4,
          Matrix4,
          MatrixStack)
{
"use strict";

	function X3DRenderingContext ()
	{
		this .addChildren ("viewport", new Fields .MFInt32 (0, 0, 100, 100));

		this .projectionMatrix      = new Matrix4 ();
		this .projectionMatrixArray = new Float32Array (16);
		this .modelViewMatrix       = new MatrixStack (Matrix4);
		this .clipPlanes            = [ ];
	}

	X3DRenderingContext .prototype =
	{
		initialize: function ()
		{
			// Configure context.

			var gl = this .getContext ();

			gl .enable (gl .SCISSOR_TEST);
			gl .cullFace (gl .BACK);
			gl .enable (gl .DEPTH_TEST);
			gl .depthFunc (gl .LEQUAL);
			gl .clearDepth (1);

			gl .blendFuncSeparate (gl .SRC_ALPHA, gl .ONE_MINUS_SRC_ALPHA, gl .ONE, gl .ONE_MINUS_SRC_ALPHA);
			gl .enable (gl .BLEND);

			// Configure viewport.

			setInterval (this .reshape .bind (this), 401); // Detect canvas resize.

			this .reshape ();

			this .depthShader = this .createShader (this, "DepthShader",     depthVS,     depthFS);
			this .pointShader = this .createShader (this, "PointShader",     wireframeVS, pointSetFS);
			this .lineShader  = this .createShader (this, "WireframeShader", wireframeVS, wireframeFS);

			this .pointShader .setGeometryType (0);
			this .lineShader  .setGeometryType (1);

			this .setShading ("GOURAUD");
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
		getDepthSize: function ()
		{
			var gl = this .context;

			return gl .getParameter (gl .DEPTH_BITS);
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
		createShader: function (executionContext, name, vs, fs)
		{
			var vertexShader = new ShaderPart (executionContext);
			vertexShader .url_ .push (vs);
			vertexShader .setup ();

			var fragmentShader = new ShaderPart (executionContext);
			fragmentShader .type_ = "FRAGMENT";
			fragmentShader .url_ .push (fs);
			fragmentShader .setup ();
	
			var shader = new ComposedShader (executionContext);
			shader .setName (name);
			shader .language_ = "GLSL";
			shader .parts_ .push (vertexShader);
			shader .parts_ .push (fragmentShader);
			shader .setCustom (false);
			shader .setup ();

			this .getLoadSensor () .watchList_ .push (vertexShader);
			this .getLoadSensor () .watchList_ .push (fragmentShader);

			return shader;
		},
		setShading: function (type)
		{
			var gl = this .context;

			switch (type)
			{
				case "PHONG":
				{
					if (! this .phongShader)
						this .phongShader = this .createShader (this, "PhongShader", phongVS, phongFS);

					this .defaultShader = this .phongShader;
					break;
				}
				default:
				{
					if (! this .gouraudShader)
						this .gouraudShader = this .createShader (this, "GouraudShader", gouraudVS, gouraudFS);

					this .defaultShader = this .gouraudShader;
					break;
				}
			}

			// Configure custom shaders

			this .pointShader   .setShading (type);
			this .lineShader    .setShading (type);
			this .defaultShader .setShading (type);

			var shaders = this .getShaders ();

			for (var id in shaders)
				shaders [id] .setShading (type);
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
		getDepthShader: function ()
		{
			return this .depthShader;
		},
		getClipPlanes: function ()
		{
			return this .clipPlanes;
		},
		reshape: function ()
		{
			var
			   canvas = this .canvas,
				width  = canvas .width (),
				height = canvas .height ();

			canvas = canvas [0];

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
