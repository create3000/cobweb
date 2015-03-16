
define ([
	"cobweb/Browser/Core/RenderingProperties"
],
function (RenderingProperties)
{
	function getContext (canvas)
	{
		try
		{
			var gl = canvas .getContext ('experimental-webgl');

			if (gl === null)
				gl = canvas .getContext ('webgl');

			return gl;
		}
		catch (error)
		{
			return null;
		}
	}

	function X3DCoreContext (x3d)
	{
		this .x3d = x3d;
	}

	X3DCoreContext .prototype =
	{
		initialize: function ()
		{
			// Get canvas & context.

			var browser = $("<div/>") .addClass ("browser") .prependTo (this .x3d);
			var canvas  = $("<div/>") .addClass ("canvas")  .prependTo (browser);

			this .canvas  = $("<canvas/>") .prependTo (canvas);
			this .context = getContext (this .canvas [0]);

			this .renderingProperties = new RenderingProperties (this);
			this .renderingProperties .setup ();
		},
		getX3D: function ()
		{
			return this .x3d;
		},
		getCanvas: function ()
		{
			return this .canvas;
		},
		getContext: function ()
		{
			return this .context;
		},
		getRenderingProperties: function ()
		{
			return this .renderingProperties;
		},
	};

	return X3DCoreContext;
});
