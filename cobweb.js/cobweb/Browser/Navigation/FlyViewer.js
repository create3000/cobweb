
define ([
	"cobweb/Browser/Navigation/X3DFlyViewer",
],
function (X3DFlyViewer)
{
	function FlyViewer (executionContext)
	{
		X3DFlyViewer .call (this, executionContext .getBrowser (), executionContext);
	}

	FlyViewer .prototype = $.extend (Object .create (X3DFlyViewer .prototype),
	{
		constructor: FlyViewer,
		getTranslationOffset: function (velocity)
		{
			return this .getActiveViewpoint () .getUserOrientation () .multVecRot (velocity);
		},
	});

	return FlyViewer;
});
