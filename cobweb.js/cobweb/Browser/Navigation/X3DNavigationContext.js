
define ([
	"cobweb/Browser/Navigation/ExamineViewer",
],
function (ExamineViewer)
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
		},
	};

	return X3DNavigationContext;
});
