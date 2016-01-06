
define ([
	"cobweb/Browser/Navigation/X3DFlyViewer",
	"lib/gettext",
],
function (X3DFlyViewer, _)
{
"use strict";
	
	function FlyViewer (executionContext)
	{
		X3DFlyViewer .call (this, executionContext);
	}

	FlyViewer .prototype = $.extend (Object .create (X3DFlyViewer .prototype),
	{
		constructor: FlyViewer,
		addCollision: function ()
		{
			this .getBrowser () .addCollision (this);
		},
		removeCollision: function ()
		{
			this .getBrowser () .removeCollision (this);
		},
		getTranslationOffset: function (velocity)
		{
			return this .getActiveViewpoint () .getUserOrientation () .multVecRot (velocity);
		},
	});

	return FlyViewer;
});
