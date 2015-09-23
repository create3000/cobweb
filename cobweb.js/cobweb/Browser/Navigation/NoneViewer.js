
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
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			this .getBrowser () .getNotification () .string_ = _("None Viewer");
		},
	});

	return NoneViewer;
});
