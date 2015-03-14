
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

	Loader .prototype =
	{
		getWorldURL: function ()
		{
			return this .URL;
		},
		createX3DFromString: function (worldURL, string)
		{
			var scene = this .browser .createScene ();

			scene .setWorldURL (this .browser .getLocation () .transform (worldURL));

			//

			var dom = $.parseXML (string);

			new XMLParser (scene, dom) .parseIntoScene ();

			return scene;
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

			$.ajax ({
				url: this .URL,
				dataType: "text",
				async: true,
				//timeout: 15000,
				global: false,
				context: this,
				success: function (data)
				{
					try
					{
						return this .callback (this .createX3DFromString (this .URL, data));
					}
					catch (error)
					{
						console .log (error);

						if (this .url .length)
							this .createX3DFromURLAsync (this .url .shift ());

						else
							this .callback (null);
					}
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console .log ("Couldn't load URL '" + this .URL .toString () + "': " + errorThrown + ".");

					if (this .url .length)
						this .createX3DFromURLAsync (this .url .shift ());

					else
						this .callback (null);
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
							scene   = this .createX3DFromString (this .URL, data);
							success = true;
						}
						catch (error)
						{
							//console .log (error);
						}
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console .log ("Couldn't load URL '" + this .URL .toString () + "': " + errorThrown + ".");
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

			console .log ("Trying to load URL '" + URL .toString () + "'.");

			return URL .isLocal () ? this .browser .getLocation () .getRelativePath (URL) : URL;
		},
	};

	return Loader;
});