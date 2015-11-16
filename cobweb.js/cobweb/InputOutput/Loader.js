
define ([
	"jquery",
	"cobweb/Base/X3DObject",
	"cobweb/Parser/Parser",
	"cobweb/Parser/XMLParser",
	"standard/Networking/URI",
	"lib/BinaryTransport",
	"lib/pako/dist/pako_inflate",
],
function ($,
          X3DObject,
          Parser,
          XMLParser,
          URI,
          BinaryTransport,
          pako)
{
"use strict";

	BinaryTransport ($);

	var TIMEOUT = 16;

	function Loader (node, external)
	{
		X3DObject .call (this);

		this .node             = node;
		this .browser          = node .getBrowser ();
		this .external         = this .browser .isExternal () || external;
		this .executionContext = this .external ? node .getExecutionContext () : this .browser .currentScene;
		this .URL              = new URI ();
		this .fileReader       = new FileReader ();
	}

	Loader .prototype = $.extend (Object .create (X3DObject .prototype),
	{
		constructor: Loader,
		getWorldURL: function ()
		{
			return this .URL;
		},
		createX3DFromString: function (worldURL, string, success, error)
		{
			var scene = this .browser .createScene ();

			scene .setWorldURL (this .browser .getLocation () .transform (worldURL));

			if (success)
			{
				try
				{
					setTimeout (this .importDocument .bind (this, scene, $.parseXML (string), success, error), TIMEOUT);
				}
				catch (exceptionParseXML)
				{
					// If we cannot parse XML we try to parse X3D Classic Encoding.	

					new Parser (scene, string) .parseIntoScene ();

					this .setScene (scene, success);
				}
			}
			else
			{
				try
				{
					this .importDocument (scene, $.parseXML (string));
					return scene;
				}
				catch (exception1)
				{
					var exception1 = new Error ("Couldn't parse XML");

					try
					{
						// If we cannot parse XML we try to parse X3D Classic Encoding.	
	
						new Parser (scene, string) .parseIntoScene ();
						return scene;
					}
					catch (exception2)
					{
						throw exception2;
					}
				}
			}
		},
		importDocument: function (scene, dom, success, error)
		{
			try
			{
				new XMLParser (scene, dom) .parseIntoScene ();

				if (success)
					this .setScene (scene, success);
			}
			catch (exception)
			{
				if (error)
					error (exception);
				else
					throw exception;
			}
		},
		setScene: function (scene, success)
		{
			scene .loadCount_ .addInterest (this, "set_loadCount", scene, success);
			scene .loadCount_ .addEvent ();
		},
		set_loadCount: function (field, scene, success)
		{
			if (field .getValue () === 0)
				success (scene);

			if (this .URL .length)
				console .log ("Done loading scene " + this .URL);
		},
		createX3DFromURL: function (url, callback, bindViewpoint)
		{
			this .bindViewpoint = bindViewpoint;

			if (callback)
				return setTimeout (this .loadDocument .bind (this, url, this .createX3DFromURLAsync .bind (this, callback)), TIMEOUT);

			return this .createX3DFromURLSync (url);
		},
		createX3DFromURLAsync: function (callback, data)
		{
			if (data === null)
				callback (null);
			else
				this .createX3DFromString (this .URL, data, callback, this .loadDocumentError .bind (this));
		},
		createX3DFromURLSync: function (url)
		{
			if (url .length === 0)
				throw new Error ("No URL given.");

			var
				scene   = null,
				success = false;

			for (var i = 0; i < url .length; ++ i)
			{
				this .URL = this .transform (url [i]);

				$.ajax ({
					url: this .URL,
					dataType: "text",
					async: false,
					cache: this .browser .doCaching (),
					//timeout: 15000,
					global: false,
					context: this,
					success: function (data)
					{
						try
						{
							scene   = this .createX3DFromString (this .URL, data);
							success = true;
						}
						catch (exception)
						{
							this .error (exception);
						}
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						//console .warn ("Couldn't load URL '" + this .URL .toString () + "': " + errorThrown + ".");
					},
				});

				if (success)
					break;
			}

			if (success)
				return scene;

			throw new Error ("Couldn't load any url of '" + url .getValue () .join (", ") + "'.");
		},
		loadDocument: function (url, callback)
		{
			this .url      = url .copy ();
			this .callback = callback;

			if (url .length === 0)
				return this .loadDocumentError (new Error ("No URL given."));

			this .loadDocumentAsync (this .url .shift ());
		},
		loadDocumentAsync: function (URL)
		{
			try
			{
				if (this .bindViewpoint)
				{
					var uri = new URI (URL);

					if (uri .filename .toString () .length === 0 && uri .filename .query .length === 0)
					{
						return this .bindViewpoint (uri .fragment);
					}
				}
			}
			catch (exception)
			{
				return this .loadDocumentError (exception);
			}

			this .URL = this .transform (URL);

			$.ajax ({
				url: this .URL,
				dataType: "binary",
				async: true,
				cache: this .browser .doCaching (),
				//timeout: 15000,
				global: false,
				context: this,
				success: function (blob, status)
				{
					this .fileReader .onload = this .readAsText .bind (this, blob);

					this .fileReader .readAsText (blob);
				},
				error: function (jqXHR, textStatus, exception)
				{
					this .loadDocumentError (exception);
				},
			});
		},
		readAsText: function (blob)
		{
			try
			{
				this .callback (this .fileReader .result);
			}
			catch (exception)
			{
				this .fileReader .onload = this .readAsArrayBuffer .bind (this, exception);

				this .fileReader .readAsArrayBuffer (blob);
			}
		},
		readAsArrayBuffer: function (exceptionReadAsText)
		{
			try
			{
				this .callback (pako .ungzip (this .fileReader .result, { to: "string" }));
			}
			catch (exception)
			{
				this .loadDocumentError (exceptionReadAsText);
			}
		},
		loadDocumentError: function (exception)
		{
			// Output exception.

			this .error (exception);

			// Try to load next URL.

			if (this .url .length)
				this .loadDocumentAsync (this .url .shift ());

			else
				this .callback (null);
		},
		error: function (exception)
		{
			// Output exception.

			var message = "Couldn't load URL " + this .URL;

			if (exception)
				message += ": " + exception;

			console .warn (message);
		},
		transform: function (URL)
		{
			URL = this .getReferer () .transform (new URI (URL));

			URL = URL .isLocal () ? this .browser .getLocation () .getRelativePath (URL) : URL;

			return URL;
		},
		getReferer: function ()
		{
			if (this .node .getTypeName () === "World")
			{
				if (this .external)
					return this .browser .getLocation ();
			}

			return this .executionContext .getWorldURL ();
		},
	});

	return Loader;
});