
define (function ()
{
"use strict";

	return function ($)
	{
		// Use this transport for "binary" data type
		$.ajaxTransport ("+binary", function (options, originalOptions, jqXHR)
		{
			// Check for conditions and support for blob / arraybuffer response type
			if (options .dataType && options .dataType == 'binary')
			{
				return {
					send: function (headers, callback)
					{
						// Setup all variables
						var xhr = options .xhr ();

						xhr .open (options .type, options .url, options .async, options .username, options .password);

						// Apply custom fields if provided
						if ( options.xhrFields )
						{
							for (i in options.xhrFields)
								xhr [i] = options .xhrFields [i];
						}

						// Override mime type if needed
						if (options .mimeType && xhr .overrideMimeType)
							xhr .overrideMimeType (options .mimeType);

						// Setup custom headers
						for (var i in headers)
							xhr .setRequestHeader (i, headers [i]);

						// Setup onload callback
						xhr .onload = function ()
						{
							xhr .onload = xhr .onerror = null;

							var data = { };

							data [options .dataType] = xhr .response;

							callback (xhr .status, xhr .statusText, data, xhr .getAllResponseHeaders ());
						};

						// Setup onerror callback
						xhr.onerror = function ()
						{
							xhr .onload = xhr .onerror = null;

							callback (xhr .status || 404, xhr .statusText);
						};
						
						// Send data
						xhr .responseType = options .responseType || "blob";
						xhr .send (options .hasContent && options .data || null);
					},
					abort: function ()
					{
						var xhr = options .xhr ();

						xhr .onload = xhr .onerror = null;

						xhr .abort ();
					}
				};
			}
		});
	};
});