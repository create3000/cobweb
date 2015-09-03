
define ([
	"cobweb/Fields",
	"standard/Networking/URI",
],
function (Fields,
          URI)
{
	with (Fields)
	{
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
			addLoadCount: function (object)
			{
			   if (! this .loadingObjects [object .getId ()])
			      this .loadingObjects [object .getId ()] = 0;

			   ++ this .loadingObjects [object .getId ()];

				this .loadCount_ = this .loadCount_ .getValue () + 1;
				this .getNotification () .string_ = "Loading " + this .loadCount_;
				this .setCursor ("DEFAULT");
			},
			removeLoadCount: function (object)
			{
			   if (! this .loadingObjects .hasOwnProperty (object .getId ()))
			      return;
			   
				-- this .loadingObjects [object .getId ()];

			   if (! this .loadingObjects [object .getId ()])
			   	delete this .loadingObjects [object .getId ()];

				this .loadCount_ = this .loadCount_ .getValue () - 1;

				if (this .loadCount_ .getValue ())
					this .getNotification () .string_ = "Loading " + this .loadCount_;
				else
				{
					this .getNotification () .string_ = "Loading done";
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
