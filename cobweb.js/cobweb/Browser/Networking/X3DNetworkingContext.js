
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
		},
		getLocation: function ()
		{
			return this .location;
		},
		getDefaultScene: function ()
		{
			return this .defaultScene;
		},
	};

	return X3DNetworkingContext;
});
