
define ([
	"cobweb/Components/Layering/Viewport",
],
function (Viewport)
{
	function X3DLightingContext ()
	{
		this .globalLights = [ ];
	}

	X3DLightingContext .prototype =
	{
		initialize: function () { },
		getGlobalLights: function ()
		{
			return this .globalLights;
		},
	};

	return X3DLightingContext;
});
