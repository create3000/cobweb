
define ([
	"cobweb/Browser/Core/BrowserOptions",
	"cobweb/Browser/Core/RenderingProperties",
	"cobweb/Browser/Core/Notification",
	"cobweb/Browser/Core/BrowserTimings",
	"cobweb/Browser/Core/ContextMenu",
],
function (BrowserOptions,
          RenderingProperties,
          Notification,
          BrowserTimings,
          ContextMenu)
{
"use strict";
	
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

		// Get canvas & context.

		var browser = $("<div/>") .addClass ("cobweb-browser") .prependTo (this .xml);
		var canvas  = $("<div/>") .addClass ("cobweb-surface") .prependTo (browser);

		this .canvas  = $("<canvas/>") .prependTo (canvas);
		this .context = getContext (this .canvas [0]);

		this .browserOptions      = new BrowserOptions (this);
		this .renderingProperties = new RenderingProperties (this);
		this .notification        = new Notification (this);
		this .browserTimings      = new BrowserTimings (this);
		this .contextMenu         = new ContextMenu (this);
	}

	X3DCoreContext .prototype =
	{
		initialize: function ()
		{
			this .browserOptions      .setup ()
			this .renderingProperties .setup ();
			this .notification        .setup ();
			this .browserTimings      .setup ();
			this .contextMenu         .setup ();
		},
		isStrict: function ()
		{
			return true;
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
		getBrowserTimings: function ()
		{
			return this .browserTimings;
		},
	};

	return X3DCoreContext;
});
