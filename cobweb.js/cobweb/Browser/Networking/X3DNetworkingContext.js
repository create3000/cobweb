
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
			   if (this .loadingObjects .hasOwnProperty (object .getId ()))
			      return;

			   this .loadingObjects [object .getId ()] = true;

				var value = this .loadCount_ .getValue () + 1;
				this .loadCount_ = value;
				this .getNotification () .string_ = "Loading " + value;
				this .setCursor ("DEFAULT");
			},
			removeLoadCount: function (object)
			{
			   if (! this .loadingObjects .hasOwnProperty (object .getId ()))
			      return;

			   delete this .loadingObjects [object .getId ()];

				var value = this .loadCount_ .getValue () - 1;
				this .loadCount_ = value;

				if (value)
					this .getNotification () .string_ = "Loading " + value;
				else
				{
					this .getNotification () .string_ = "Loading done";
					this .setCursor ("DEFAULT");
				}
			},
		};

		return X3DNetworkingContext;
	}
});
