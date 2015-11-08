
define ([
	"jquery",
],
function ($)
{
"use strict";

	// Everything went wrong when the Error function is called.

	function Error (error, fallbacks)
	{
		$(function ()
		{
		   var elements = $("X3D");

			elements .each (function ()
			{
				Error .fallback ($(this));
			});

			for (var i = 0; i < fallbacks .length; ++ i)
			{
			   var fallback = fallbacks [i];

				if (typeof fallback === "function")
				   fallback (elements, error);
			}
		});
	}

	// In some browser went something wrong when the fallback function is called.

	function fallback (elements)
	{
		elements .addClass ("cobweb-fallback");
	}

	Error .fallback = fallback;

	return Error;
});
