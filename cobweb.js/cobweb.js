
(function ()
{
"use strict";

	function X3D (callback, fallback)
	{
		X3D .callbacks .push (callback);
		X3D .fallbacks .push (fallback);
	}

	function fallback (error)
	{
		require (["cobweb/Error"],
		function (Error)
		{
			Error (error, window .X3D .fallbacks);

			delete window .X3D;
		});
	}

	// Temporary X3D before page load.
	if (window .X3D === undefined)
	{
		X3D .callbacks = [ ];
		X3D .fallbacks = [ ];
		window .X3D    = X3D;

		if (window .Proxy === undefined)
		   return fallback ("Proxy is not defined");

		require (["cobweb/X3D"],
		function (X3D)
		{
			var
				callbacks = window .X3D .callbacks,
				fallbacks = window .X3D .fallbacks;

			window .X3D = X3D; // Now assign real X3D.

			X3D (); // Initialize all X3D tags

			for (var i = 0; i < callbacks .length; ++ i)
			   X3D (callbacks [i], fallbacks [i]);
		},
		fallback);
	}
}) ();