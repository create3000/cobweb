
define ([
	"cobweb/Browser/Navigation/X3DFlyViewer",
	"lib/gettext",
],
function (X3DFlyViewer, _)
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
