
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Browser/X3DBrowser",
],
function ($, Fields, X3DBrowser)
{
	// Console fallback

	if (! console)        console        = { };
	if (! console .log)   console .log   = function () { };
	if (! console .info)  console .info  = console .log;
	if (! console .warn)  console .warn  = console .log;
	if (! console .error) console .error = console .log;

	function getBrowser (x3d)
	{
		return $(x3d) [0] .browser;
	}

	function createBrowser (x3d)
	{
		x3d = $(x3d);
	
		var browser = new X3DBrowser (x3d);

		browser .setup ();
		browser .importDocument (x3d [0]);

		setTimeout (browser .getWorld () .bind .bind (browser .getWorld ()), 0);
		return browser;
	}

	// X3D

	var deferred = $.Deferred ();

	function X3D (callback)
	{
		if (callback)
			deferred .done (callback);

		if (X3D .initialized)
			return;

		X3D .initialized = true;

		$(document) .ready (function ()
		{
			var elements = $("X3D");
		
			elements .each (function ()
			{
				try
				{
					this .browser = createBrowser (this);
				}
				catch (error)
				{
					fallback ($(this), error);
				}
			});

			if (elements .length)
				deferred .resolve (elements);
		});
	}

	function error (what)
	{
		$(document) .ready (function ()
		{
			$("X3D") .each (function ()
			{
				fallback ($(this), what);
			});
		});
	}

	function fallback (node, error)
	{
		node .children ("canvas") .remove ();
		$("<div/>") .appendTo (node) .addClass ("fallback");
		this .console .log ("Unable to initialize Cobweb. Your browser may not support it.");
		this .console .log (error);
	}

	return $.extend (X3D, Fields,
	{
		initialized: false,
		getBrowser: getBrowser,
		createBrowser: createBrowser,
		error: error
	});
});
