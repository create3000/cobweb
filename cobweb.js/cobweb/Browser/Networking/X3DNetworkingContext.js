
define ([
	"standard/Networking/URI",
],
function (URI)
{
	function X3DNetworkingContext () { }

	X3DNetworkingContext .prototype =
	{
		initialize: function ()
		{
			this .location     = new URI (window .location);
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
	};

	return X3DNetworkingContext;
});
