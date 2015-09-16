
define ([
	"cobweb/Browser/Navigation/X3DFlyViewer",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
],
function (X3DFlyViewer, Vector3, Rotation4)
{
	var yAxis = new Vector3 (0, 1, 0);
	
	function WalkViewer (executionContext)
	{
		X3DFlyViewer .call (this, executionContext .getBrowser (), executionContext);
	}

	WalkViewer .prototype = $.extend (Object .create (X3DFlyViewer .prototype),
	{
		constructor: WalkViewer,
		initialize: function ()
		{
			X3DFlyViewer .prototype .initialize .call (this);

			this .getBrowser () .getNotification () .string_ = "Walk Viewer";
		},
		getTranslationOffset: function (velocity)
		{
			var
				viewpoint = this .getActiveViewpoint (),
				upVector  = viewpoint .getUpVector ();

			var
				userOrientation = viewpoint .getUserOrientation () .copy (),
				orientation     = userOrientation .multRight (new Rotation4 (userOrientation .multVecRot (yAxis .copy ()), upVector));

			return orientation .multVecRot (velocity);
		},
	});

	return WalkViewer;
});
