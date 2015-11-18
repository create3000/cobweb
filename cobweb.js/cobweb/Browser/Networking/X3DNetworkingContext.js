
define ([
	"cobweb/Fields",
	"standard/Networking/URI",
	"lib/sprintf.js/src/sprintf",
	"lib/gettext",
],
function (Fields,
          URI,
          sprintf,
          _)
{
"use strict";
	
	var loadCountId = 0;

	function X3DNetworkingContext () { }

	X3DNetworkingContext .prototype =
	{
		initialize: function ()
		{
		   this .cache = this .getXML () [0] .getAttribute ("cache") != "false";

			this .addChildren ("loadCount", new Fields .SFInt32 ());
			this .loadingObjects = { };

			this .location     = new URI (this .getXML () [0] .baseURI);
			this .defaultScene = this .createScene ();
			this .defaultScene .setup ();
			this .defaultScene .beginUpdate ();

			this .privateScene = this .createScene ();
			this .privateScene .setup ();
			this .privateScene .beginUpdate ();
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
