
define ([
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
	"external/jquery.ba-resize.min",
],
function (Vector4,
          Matrix4,
          MatrixStack)
{
	function X3DRenderingContext (x3d)
	{
		this .x3d                = x3d;
		this .projectionMatrix   = new MatrixStack (Matrix4);
		this .modelViewMatrix    = new MatrixStack (Matrix4);
		this .viewport           = new Vector4 ();
		this .defaultColorBuffer = null;
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
			gl .enable (gl .BLEND);

			// Create default color buffer.

			this .defaultColorBuffer         = gl .createBuffer ();
			this .defaultColorBuffer .length = 0;

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
			return this .getContext () .getParameter (this .getContext () .SAMPLES) > 1;
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
