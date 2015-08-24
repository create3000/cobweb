
define ([
	"cobweb/Browser/Navigation/ExamineViewer",
	"cobweb/Components/Lighting/DirectionalLight",
],
function (ExamineViewer, DirectionalLight)
{
	function X3DNavigationContext ()
	{
	}

	X3DNavigationContext .prototype =
	{
		initialize: function ()
		{
			this .viewer = new ExamineViewer (this);
			this .viewer .setup ();
			
			var headlight = new DirectionalLight (this);
			headlight .setup ();
			this .headlight = headlight .getContainer ();
		},
		getHeadlight: function ()
		{
			return this .headlight;
		},
	};

	return X3DNavigationContext;
});
