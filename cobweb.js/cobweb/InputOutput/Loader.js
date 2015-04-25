
define ([
	"jquery",
	"cobweb/Base/X3DObject",
	"cobweb/Parser/XMLParser",
	"standard/Networking/URI",
	"cobweb/Debug",
],
function ($,
          X3DObject,
          XMLParser,
          URI,
          DEBUG)
{
	var TIMEOUT = 16;

	function Loader (node)
	{
		X3DObject .call (this);

		this .node             = node;
		this .browser          = node .getBrowser ();
		this .external         = this .browser .isExternal ();
		this .executionContext = this .external ? node .getExecutionContext () : this .browser .currentScene;
		this .URL              = new URI ();
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
				catch (exception)
				{
					error (exception);
				}
			}
			else
			{
				this .importDocument (scene, $.parseXML (string));
				return scene;
			}
		},
		importDocument: function (scene, dom, success, error)
		{
			try
			{
				new XMLParser (scene, dom) .parseIntoScene ();

				if (success)
				{
					scene .loadCount_ .addInterest (this, "setLoadCount", scene, success);
					scene .loadCount_ .addEvent ();
				}
			}
			catch (exception)
			{
				if (error)
					error (exception);
				else
					throw exception;
			}
		},
		setLoadCount: function (field, scene, success)
		{
			if (field .getValue () === 0)
				success (scene);
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
					cache: false,
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
						catch (error)
						{
							console .log (error);
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

			throw Error ("Couldn't load any url of '" + url .getValue () .join (", ") + "'.");
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
				dataType: "text",
				async: true,
				cache: false,
				//timeout: 15000,
				global: false,
				context: this,
				success: function (data)
				{
					try
					{
						this .callback (data);
					}
					catch (exception)
					{
						this .loadDocumentError (exception);
					}
				},
				error: function (jqXHR, textStatus, exception)
				{
					this .loadDocumentError (exception);
				},
			});
		},
		loadDocumentError: function (exception)
		{
			if (DEBUG)
				console .log (exception);
			else
				console .warn ("Couldn't load URL '" + this .URL .toString () + "': " + exception .message + ".");

			if (this .url .length)
				this .loadDocumentAsync (this .url .shift ());

			else
				this .callback (null);
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