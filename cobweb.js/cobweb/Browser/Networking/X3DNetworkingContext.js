
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

		this .location     = new URI (this .getElement () [0] .baseURI);
		this .defaultScene = this .createScene ();
		this .privateScene = this .createScene ();
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
		addLoadCount: function ()
		{
		   var id = loadCountId ++;

		   this .loadingObjects [id] = true;
			
			var loadCount = this .loadCount_ = this .loadCount_ .getValue () + 1;

			this .getNotification () .string_ = sprintf .sprintf (loadCount == 1 ? _ ("Loading %d file") : _ ("Loading %d files"), loadCount);
			this .setCursor ("DEFAULT");

			return id;
		},
		removeLoadCount: function (id)
		{
		   if (! this .loadingObjects .hasOwnProperty (id))
		      return;
		   
			delete this .loadingObjects [id];

			var loadCount = this .loadCount_ = this .loadCount_ .getValue () - 1;

			if (loadCount)
				this .getNotification () .string_ = sprintf .sprintf (loadCount == 1 ? _ ("Loading %d file") : _ ("Loading %d files"), loadCount);
			else
			{
				this .getNotification () .string_ = _("Loading done");
				this .setCursor ("DEFAULT");
			}
		},
		resetLoadCount: function ()
		{
			this .loadCount_     = 0;
			this .loadingObjects = { };			   
		},
	};

	return X3DNetworkingContext;
});
