
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
					var x3d = $(this);

					this .browser = new X3DBrowser (x3d);
					this .browser .setup ();
					this .browser .importDocument (this);
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
		getBrowser: function (x3d)
		{
			return $(x3d) [0] .browser;
		},
		error: error
	});
});
