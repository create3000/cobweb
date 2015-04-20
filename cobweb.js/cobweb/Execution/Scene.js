
define ([
	"cobweb/Execution/X3DScene",
],
function (X3DScene)
{
	function Scene (browser)
	{
		X3DScene .call (this, browser, this);
	}

	Scene .prototype = $.extend (Object .create (X3DScene .prototype),
	{
		constructor: Scene,
		getTypeName: function ()
		{
			return "Scene";
		},
	});

	return Scene;
});
