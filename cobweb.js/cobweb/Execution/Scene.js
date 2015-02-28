
define ([
	"cobweb/Execution/X3DScene",
],
function (X3DScene)
{
	function Scene (browser)
	{
		X3DScene .call (this, browser, this);
	}

	Scene .prototype = $.extend (new X3DScene (),
	{
		constructor: Scene,
		getTypeName: function ()
		{
			return "Scene";
		},
	});

	return Scene;
});
