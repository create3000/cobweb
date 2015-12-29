
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
		var context = canvas .getContext ("webgl") || canvas .getContext ("experimental-webgl");

		if (context)
			return context;

		throw new Error ("Couldn't create WebGL context.");
	}

	function X3DCoreContext (element)
	{
		this .element = element;

		// Get canvas & context.

		var browser = $("<div/>") .addClass ("cobweb-browser") .prependTo (this .element);
		var loading = $("<div/>") .addClass ("cobweb-loading") .appendTo (browser);
		var spinner = $("<div/>") .addClass ("cobweb-spinner") .appendTo (loading);
		var canvas  = $("<div/>") .addClass ("cobweb-surface") .appendTo (browser);

		$("<div/>") .addClass ("cobweb-spinner-one") .appendTo (spinner);
		$("<div/>") .addClass ("cobweb-spinner-two") .appendTo (spinner);
		$("<div/>") .addClass ("cobweb-spinner-three") .appendTo (spinner);
		$("<div/>") .addClass ("cobweb-spinner-text") .text ("Lade 0 Dateien") .appendTo (spinner);

		this .loading = loading;
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
			return false;
		},
		getElement: function ()
		{
			return this .element;
		},
		getLoadingElement: function ()
		{
			return this .loading;
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
