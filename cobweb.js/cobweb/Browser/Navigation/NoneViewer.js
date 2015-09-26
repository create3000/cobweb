
define ([
	"jquery",
	"cobweb/Browser/Navigation/X3DViewer",
	"lib/gettext",
],
function ($, X3DViewer, _)
{
	function NoneViewer (executionContext)
	{
		X3DViewer .call (this, executionContext .getBrowser (), executionContext);
	}

	NoneViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: NoneViewer,
	});

	return NoneViewer;
});
