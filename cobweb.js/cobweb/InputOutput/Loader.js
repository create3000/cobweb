
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
	}

	Loader .prototype =
	{
		createX3DFromString: function (worldURL, string)
		{
			var scene = this .browser .createScene ();

			scene .setWorldURL (worldURL);

			//

			try
			{
				var dom = $.parseXML (string);

				new XMLParser (scene, dom) .parseIntoScene ();

				return scene;
			}
			catch (error)
			{
				console .log (error);
				throw error;
			}
		},
		createX3DFromURL: function (url)
		{
			var scene   = null;
			var success = false;

			for (var i = 0; i < url .length; ++ i)
			{
				var URL = this .executionContext .getWorldURL () .transform (new URI (url [i]));

				console .log (URL .toString ());

				$.ajax ({
					url: URL .isLocal () ? new URI (window .location) .getRelativePath (URL) : URL,
					dataType: "text",
					async: false,
					//timeout: 15000,
					global: false,
					context: this,
					complete: function (xhr, status)
					{
						if (status === "success" || status === "notmodified")
						{
							try
							{
								scene   = this .createX3DFromString (URL, xhr .responseText);
								success = true;
							}
							catch (error)
							{
								//console .log (error);
							}
						}
					},
				});
				
				if (success)
					break;
			}

			if (success)
				return scene;

			throw Error ("Couldn't load any url of '" + url .getValue () .join (", ") + "'.");
		},
	};

	return Loader;
});