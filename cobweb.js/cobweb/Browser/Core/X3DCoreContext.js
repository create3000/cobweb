
define ([
	"cobweb/Browser/Core/BrowserOptions",
	"cobweb/Browser/Core/RenderingProperties",
	"cobweb/Browser/Core/Notification",
],
function (BrowserOptions,
          RenderingProperties,
          Notification)
{
	function getContext (canvas)
	{
		try
		{
			return canvas .getContext ("webgl") || canvas .getContext ("experimental-webgl");
		}
		catch (error)
		{
			return null;
		}
	}

	function X3DCoreContext (xml)
	{
		this .xml = xml;
	}

	X3DCoreContext .prototype =
	{
		initialize: function ()
		{
			// Get canvas & context.

			var browser = $("<div/>") .addClass ("cobweb-browser") .prependTo (this .xml);
			var canvas  = $("<div/>") .addClass ("cobweb-canvas")  .prependTo (browser);

			this .canvas  = $("<canvas/>") .prependTo (canvas);
			this .context = getContext (this .canvas [0]);

			this .browserOptions      = new BrowserOptions (this);
			this .renderingProperties = new RenderingProperties (this);
			this .notification        = new Notification (this);

			this .browserOptions      .setup ()
			this .renderingProperties .setup ();
			this .notification        .setup ();
		},
		getXML: function ()
		{
			return this .xml;
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
		getNotification: function ()
		{
			return this .notification;
		},
	};

	return X3DCoreContext;
});
