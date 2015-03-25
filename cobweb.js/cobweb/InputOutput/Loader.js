
define ([
	"jquery",
	"cobweb/Parser/XMLParser",
	"standard/Networking/URI",
],
function ($, XMLParser, URI)
{
	function Loader (executionContext)
	{
		this .browser          = executionContext .getBrowser ();
		this .executionContext = executionContext;
		this .URL              = new URI ();
	}
	
	Loader .timeOut = 16;

	Loader .prototype =
	{
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
					setTimeout (this .importDocument .bind (this, scene, $.parseXML (string), success, error), Loader .timeOut);
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
					setTimeout (function ()
					{
						try
						{
							scene .setup ();

							setTimeout (success .bind (this, scene), Loader .timeOut);
						}
						catch (exception)
						{
							error (exception);
						}
					}
					.bind (this), Loader .timeOut)
				}
				else
					scene .setup ();
			}
			catch (exception)
			{
				if (error)
					error (exception);
				else
					throw exception;
			}
		},
		createX3DFromURL: function (url, callback)
		{
			if (callback)
			{
				this .url      = url .copy ();
				this .callback = callback;

				return this .createX3DFromURLAsync (this .url .shift ());
			}

			return this .createX3DFromURLSync (url);
		},
		createX3DFromURLAsync: function (URL)
		{
			this .URL = this .transform (URL);

			function error (exception)
			{
				//console .log (exception);
				//console .warn ("Couldn't load URL '" + this .URL .toString () + "': " + exception .message + ".");

				if (this .url .length)
					this .createX3DFromURLAsync (this .url .shift ());

				else
					this .callback (null);
			}
	
			$.ajax ({
				url: this .URL,
				dataType: "text",
				async: true,
				//timeout: 15000,
				global: false,
				context: this,
				success: function (data)
				{
					this .createX3DFromString (this .URL, data, this .callback, error .bind (this));
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					error .call (this, new Error (errorThrown));
				},
			});
		},
		createX3DFromURLSync: function (url)
		{
			var scene   = null;
			var success = false;

			for (var i = 0; i < url .length; ++ i)
			{
				this .URL = this .transform (url [i]);

				$.ajax ({
					url: this .URL,
					dataType: "text",
					async: false,
					//timeout: 15000,
					global: false,
					context: this,
					success: function (data)
					{
						try
						{
							scene = this .createX3DFromString (this .URL, data);
							scene .setup ();

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
		transform: function (URL)
		{
			URL = this .executionContext .getWorldURL () .transform (new URI (URL));

			//console .info ("Trying to load URL '" + URL .toString () + "'.");

			return URL .isLocal () ? this .browser .getLocation () .getRelativePath (URL) : URL;
		},
	};

	return Loader;
});