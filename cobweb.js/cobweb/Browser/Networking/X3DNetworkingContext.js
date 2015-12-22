
define ([
	"cobweb/Fields",
	"cobweb/Browser/Networking/ProviderUrl",
	"standard/Networking/URI",
	"lib/sprintf.js/src/sprintf",
	"lib/gettext",
],
function (Fields,
          ProviderUrl,
          URI,
          sprintf,
          _)
{
"use strict";
	
	var loadCountId = 0;

	function X3DNetworkingContext ()
	{
		this .cache = this .getElement () [0] .getAttribute ("cache") != "false";

		this .addChildren ("loadCount", new Fields .SFInt32 ());
		this .loadingObjects = { };

		this .location       = new URI (this .getElement () [0] .baseURI);
		this .defaultScene   = this .createScene ();
		this .privateScene   = this .createScene ();
		this .browserLoading = false;
	}

	X3DNetworkingContext .prototype =
	{
		initialize: function ()
		{
			this .defaultScene .setup ();
			this .defaultScene .beginUpdate ();

			this .privateScene .setup ();
			this .privateScene .beginUpdate ();
		},
		getProviderUrl: function ()
		{
			return ProviderUrl;
		},
		doCaching: function ()
		{
		   return this .cache;
		},
		getLocation: function ()
		{
			return this .location;
		},
		getDefaultScene: function ()
		{
			return this .defaultScene;
		},
		getPrivateScene: function ()
		{
			return this .privateScene;
		},
		setBrowserLoading: function (value)
		{
			this .browserLoading = value;

			if (value)
			{
				this .resetLoadCount ();
				this .getCanvas () .css ("display", "none");
				this .getLoadingElement () .css ("display", "block");
			}
			else
			{
				this .getLoadingElement () .fadeOut (2000);
				this .getCanvas () .fadeIn (2000);
			}
		},
		addLoadCount: function ()
		{
		   var id = loadCountId ++;

		   this .loadingObjects [id] = true;
			
			this .setLoadCount (this .loadCount_ = this .loadCount_ .getValue () + 1);
			this .setCursor ("DEFAULT");

			return id;
		},
		removeLoadCount: function (id)
		{
		   if (! this .loadingObjects .hasOwnProperty (id))
		      return;
		   
			delete this .loadingObjects [id];

			this .setLoadCount (this .loadCount_ = this .loadCount_ .getValue () - 1);
		},
		setLoadCount: function (value)
		{
			if (value)
				var string = sprintf .sprintf (value == 1 ? _ ("Loading %d file") : _ ("Loading %d files"), value);
			else
			{
				var string = _("Loading done");
				this .setCursor ("DEFAULT");
			}

			if (! this .browserLoading)
				this .getNotification () .string_ = string;

			this .getLoadingElement () .find (".cobweb-spinner-text") .text (string);
		},
		resetLoadCount: function ()
		{
			this .loadCount_     = 0;
			this .loadingObjects = { };			   
		},
	};

	return X3DNetworkingContext;
});
