
define ([
],
function ()
{
	function X3DNetworkingContext () { }

	X3DNetworkingContext .prototype =
	{
		initialize: function ()
		{
			this .defaultScene = this .createScene ();
			this .defaultScene .setup ()
		},
		getDefaultScene: function ()
		{
			return this .defaultScene;
		},
	};

	return X3DNetworkingContext;
});
