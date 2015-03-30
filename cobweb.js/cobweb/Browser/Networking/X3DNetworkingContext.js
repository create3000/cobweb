
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

				this .location     = new URI (this .getXML () [0] .baseURI);
				this .defaultScene = this .createScene ();
				this .defaultScene .setup ();

				this .privateScene = this .createScene ();
				this .privateScene .setup ();
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
				var value = this .loadCount_ .getValue () + 1;
				this .loadCount_ = value;
				this .getNotification () .string_ = "Loading " + value;
			},
			removeLoadCount: function ()
			{
				var value = this .loadCount_ .getValue () - 1;
				this .loadCount_ = value;
				this .getNotification () .string_ = "Loading " + (value ? value : "done");
			},
		};

		return X3DNetworkingContext;
	}
});
