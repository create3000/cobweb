
define ([
	"cobweb/Fields",
	"standard/Networking/URI",
	"lib/gettext",
],
function (Fields,
          URI,
          _)
{
	with (Fields)
	{
		var loadCountId = 0;

		function X3DNetworkingContext () { }

		X3DNetworkingContext .prototype =
		{
			initialize: function ()
			{
			   this .cache = this .getXML () [0] .getAttribute ("cache") != "false";

				this .addChildren ("loadCount", new SFInt32 ());
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
				this .loadCount_          = this .loadCount_ .getValue () + 1;

				this .getNotification () .string_ = _("Loading") + " " + this .loadCount_ + " " + _.count (this .loadCount_ .getValue (), "file", "files");
				this .setCursor ("DEFAULT");

				return id;
			},
			removeLoadCount: function (id)
			{
			   if (! this .loadingObjects .hasOwnProperty (id))
			      return;
			   
				delete this .loadingObjects [id];

				this .loadCount_ = this .loadCount_ .getValue () - 1;

				if (this .loadCount_ .getValue ())
					this .getNotification () .string_ =  _("Loading") + " " + this .loadCount_ + " " + _.count (this .loadCount_ .getValue (), "file", "files");
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
	}
});
