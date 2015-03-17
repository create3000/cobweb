
define ([
	"cobweb/Browser/Core/BrowserOptions",
	"cobweb/Browser/Core/RenderingProperties",
],
function (BrowserOptions,
          RenderingProperties)
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

			this .browserOptions      = new BrowserOptions (this);
			this .renderingProperties = new RenderingProperties (this);

			this .browserOptions      .setup ()
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
		getBrowserOptions: function ()
		{
			return this .browserOptions;
		},
		getRenderingProperties: function ()
		{
			return this .renderingProperties;
		},
	};

	return X3DCoreContext;
});
