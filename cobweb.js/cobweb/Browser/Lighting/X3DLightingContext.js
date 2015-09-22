
define ([
	"cobweb/Components/Layering/Viewport",
],
function (Viewport)
{
	function X3DLightingContext ()
	{
		this .globalLights = [ ]; // Global light array
		this .localLights  = [ ]; // Local light dumpster
	}

	X3DLightingContext .prototype =
	{
		initialize: function () { },
		getGlobalLights: function ()
		{
			return this .globalLights;
		},
		getLocalLights: function ()
		{
			return this .localLights;
		},
	};

	return X3DLightingContext;
});
